import logging
from datetime import datetime, timedelta
import random
import string
from functools import partial

from flask import Flask, abort, request
from jsonrpc.backend.flask import JSONRPCAPI
from pytimeparse import parse
from dateutil.parser import parse as dateparser
from voluptuous import Schema

from pabu.db import Database
from pabu.auth import is_logged_in, get_user_id
from pabu.models import Project, User, Issue, projects_users, TimeEntry, Payment, ProjectInvitationToken
from pabu.tools import sqla_model_to_voluptuous

logger = logging.getLogger(__name__)

def random_str(len: int):
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(len))

def add_api_controllers(app: Flask, db: Database):

    jsonrpc_api = JSONRPCAPI()

    app.add_url_rule('/', 'api', jsonrpc_api.as_view(), methods=['POST'])

    def entry_stat_from_list(time_entries):
        stat = {
            'spent': 0,
            'last_entry': 0,
            'count': len(time_entries),
        }
        for entry in time_entries:
            if entry.end and entry.end.timestamp() > stat['last_entry']:
                stat['last_entry'] = entry.end.timestamp()
            if entry.start.timestamp() > stat['last_entry']:
                stat['last_entry'] = entry.start.timestamp()
            stat['spent'] += ((entry.end or datetime.now()) - entry.start).total_seconds()
        return stat

    def project_to_dict(project: Project):
        paid = 0
        for payment in project.payments:
            paid += payment.amount
        return {
            'id': project.id,
            'name': project.name,
            'desc': project.desc,
            'time_stat': entry_stat_from_list(project.time_entries),
            'issues': [i.id for i in project.issues],
            'paid': paid,
            'users': [u.id for u in project.users],
            'payments': [p.id for p in project.payments],
            'tokens': [t.id for t in project.tokens],
        }

    def issue_to_dict(issue: Issue):
        return {
            'id': issue.id,
            'name': issue.name,
            'desc': issue.desc,
            'status': issue.status,
            'rank': issue.rank,
            'project_id': issue.project_id,
            'userId': issue.user_id,
            'time_stat': entry_stat_from_list(issue.time_entries),
            'time_entries': [t.id for t in issue.time_entries],
        }

    def payment_to_dict(payment: Payment):
        return {
            'id': payment.id,
            'project_id': payment.project_id,
            'created_user_id': payment.created_user_id,
            'paid_user_id': payment.paid_user_id,
            'amount': payment.amount,
            'time': payment.time.timestamp(),
            'note': payment.note,
        }

    def user_to_dict(user: User):
        return {
            'id': user.id,
            'name': user.name,
            'avatar': user.avatar,
        }

    def project_token_to_dict(prj_token: ProjectInvitationToken):
        return {
            'id': prj_token.id,
            'token': prj_token.token,
            'project_id': prj_token.project_id,
        }

    def get_current_user(conn):
        user_id = get_user_id()
        return conn.query(User).filter(User.id == user_id).first()

    @app.before_request
    def check_login(): # pylint: disable=unused-variable
        if not is_logged_in():
            abort(401)

    @app.before_request
    def common_log(): # pylint: disable=unused-variable
        logger.info("JSONRPC method '%s' called with args: %s" % (request.json['method'], request.json['params']))
        request.start = datetime.now()

    @app.after_request
    def print_time(response): # pylint: disable=unused-variable
        logger.info("JSONRPC method '%s' responded in %s ms", request.json['method'], (datetime.now() - request.start).total_seconds()*1000)
        return response

    def check_project(project_id, conn):
        user_id = get_user_id()
        if conn.query(Project).join(projects_users).join(User).filter(User.id == user_id).filter(Project.id == project_id).count() != 1:
            logger.error("check_project failed! project: %s, user: %s", project_id, user_id)
            abort(404)

    @jsonrpc_api.dispatcher.add_method
    def create_project(name: str, desc: str): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            prj = Project(name = name, desc = desc, users = [get_current_user(conn)])
            conn.add(prj)
            conn.flush()
            return project_to_dict(prj)

    @jsonrpc_api.dispatcher.add_method
    def update_project(id: int, name: str, desc: str): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(id, conn)
            project = conn.query(Project).filter(Project.id == id).first() # type: Project
            project.name = name
            project.desc = desc
            return project_to_dict(project)

    @jsonrpc_api.dispatcher.add_method
    def get_projects(id: int = None): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(Project).outerjoin(Payment).join(projects_users).join(User).filter(User.id == user_id).outerjoin(Issue)
            if id:
                qs = qs.filter(Project.id == id)
            data = {r.id: project_to_dict(r) for r in qs.all()}
        return data

    def process_resources(raw_data_list: list, model, conn, handler):
        schema = sqla_model_to_voluptuous(model)
        res = []

        for raw_data in raw_data_list:

            if 'id' in raw_data and raw_data['id'] is None:
                del raw_data['id']

            data = schema(raw_data)

            if 'pre_process' in handler:
                data.update(handler['pre_process'](data))

            if 'id' in data:
                instance = conn.query(model).filter(model.id == data['id']).first()
                if not instance:
                    abort(404)
                handler['checker'](instance)
                if 'pre_update' in handler:
                    handler['pre_update'](data, instance)
                for key, value in data.items():
                    setattr(instance, key, value)
            else:
                instance = model(**data)
                handler['checker'](instance)
                conn.add(instance)

            conn.flush()

            if 'post_process' in handler:
                new_data = handler['post_process'](data, instance)
                if new_data:
                    for key, value in new_data.items():
                        setattr(instance, key, value)
                    conn.flush()

            res.append(instance)

        return res

    @jsonrpc_api.dispatcher.add_method
    def process_issues(issues): # pylint: disable=unused-variable
        def pre_update(data: dict, issue: Issue):
            if 'status' in data and issue.status != data['status']:
                data['status_date'] = datetime.now()

        with db.session_scope() as conn:
            issues = process_resources(issues, Issue, conn, {
                'pre_process': lambda d: {'user_id': get_user_id()},
                'pre_update': pre_update,
                'checker': lambda i: check_project(i.project_id, conn),
                'post_process': lambda d, i: None if 'id' in d else {'rank': i.id},
            })
            return {i.id: issue_to_dict(i) for i in issues}

    @jsonrpc_api.dispatcher.add_method
    def get_issues(project_id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            rows = conn.query(Issue).join(Project).join(projects_users).join(User).filter(User.id == user_id).filter(Project.id == project_id).all()
            return {r.id: issue_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def get_time_entries(project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            rows = conn.query(TimeEntry).filter(Project.id == project_id).all()
            return {r.id: time_entry_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def add_time(project_id: int, amount: str, start: str, issue_id = None): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            check_project(project_id, conn)
            seconds = parse(amount)
            start = dateparser(start) if start else (datetime.now() - timedelta(seconds = seconds))
            end = start + timedelta(seconds = seconds)
            entry = TimeEntry(project_id = project_id, issue_id = issue_id, start = start, end = end, user_id = user_id)
            conn.add(entry)

    @jsonrpc_api.dispatcher.add_method
    def start_time(project_id, issue_id = None): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            check_project(project_id, conn)
            entry = TimeEntry(project_id = project_id, issue_id = issue_id, user_id = user_id)
            conn.add(entry)

    @jsonrpc_api.dispatcher.add_method
    def stop_time(): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            entry = conn.query(TimeEntry).filter(TimeEntry.user_id == user_id).filter(TimeEntry.end.is_(None)).first()
            if entry:
                entry.end = datetime.now()
                return time_entry_to_dict(entry)


    def time_entry_to_dict(time_entry: TimeEntry):
        return {
            'id': time_entry.id,
            'issueId': time_entry.issue_id,
            'project_id': time_entry.project_id,
            'userId': time_entry.user_id,
            'start': time_entry.start.timestamp(),
            'end': time_entry.end.timestamp() if time_entry.end else None,
        }

    @jsonrpc_api.dispatcher.add_method
    def get_ticking_stat(): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            entry = conn.query(TimeEntry).filter(TimeEntry.user_id == user_id, TimeEntry.end.is_(None)).first()
            if entry:
                return {'ticking': True, 'entry': time_entry_to_dict(entry)}
            else:
                return {'ticking': False}
        return {}

    @jsonrpc_api.dispatcher.add_method
    def get_payments(project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            rows = conn.query(Payment).filter(Payment.project_id == project_id).all()
            return {r.id:payment_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def add_payment(project_id: int, amount: str, paid_user_id: int, time: str, note: str): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            check_project(project_id, conn)
            payment = Payment(project_id = project_id, amount = parse(amount), paid_user_id = paid_user_id, created_user_id = user_id,
                              note = note, time = dateparser(time) if time else datetime.now())
            conn.add(payment)
            return True

    @jsonrpc_api.dispatcher.add_method
    def get_project_users(project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            rows = conn.query(User).join(projects_users).join(Project).filter(Project.id == project_id).all()
            return {r.id: user_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def delete_project(id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(id, conn)
            conn.query(Project).filter(Project.id == id).delete()
            return True

    @jsonrpc_api.dispatcher.add_method
    def delete_issue(id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            issue = conn.query(Issue).join(Project).join(projects_users).join(User).filter(User.id == user_id).filter(Issue.id == id).first()
            if not issue:
                abort(404)
            conn.delete(issue)
            return True

    @jsonrpc_api.dispatcher.add_method
    def delete_time_entry(id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(TimeEntry).join(Project).join(projects_users).join(User).filter(User.id == user_id).filter(TimeEntry.id == id)
            entry = qs.first()
            if not entry:
                abort(404)
            conn.delete(entry)
            return True

    @jsonrpc_api.dispatcher.add_method
    def delete_payment(id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(Payment).join(Project).join(projects_users).join(User).filter(User.id == user_id).filter(Payment.id == id)
            payment = qs.first()
            if not payment:
                abort(404)
            conn.delete(payment)
            return True

    @jsonrpc_api.dispatcher.add_method
    def create_project_token(id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            proj_token = ProjectInvitationToken(project_id = id, token = random_str(32))
            conn.add(proj_token)
            conn.flush()
            return project_token_to_dict(proj_token)

    @jsonrpc_api.dispatcher.add_method
    def delete_project_token(id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(ProjectInvitationToken).join(Project).join(projects_users).join(User).filter(User.id == user_id).filter(ProjectInvitationToken.id == id)
            prj_token = qs.first()
            if not prj_token:
                abort(404)
            conn.delete(prj_token)
            return True

    @jsonrpc_api.dispatcher.add_method
    def get_project_tokens(id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(id, conn)
            rows = conn.query(ProjectInvitationToken).filter(ProjectInvitationToken.project_id == id).all()
            return {r.id: project_token_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def join_to_project(token: str): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            user_id = get_user_id()
            prj_token = conn.query(ProjectInvitationToken).filter(ProjectInvitationToken.token == token).first()
            if not prj_token:
                abort(404)
            project = conn.query(Project).filter(Project.id == prj_token.project_id).first() # type: Project
            user = conn.query(User).filter(User.id == user_id).first()
            if user not in project.users:
                project.users.append(user)
            return True

    @jsonrpc_api.dispatcher.add_method
    def kick_user_from_project(project_id: int, user_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            project = conn.query(Project).filter(Project.id == project_id).first() # type: Project
            user = conn.query(User).filter(User.id == user_id).first()
            project.users.remove(user)
            return True

    @jsonrpc_api.dispatcher.add_method
    def leave_project(project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            user_id = get_user_id()
            project = conn.query(Project).filter(Project.id == project_id).first() # type: Project
            user = conn.query(User).filter(User.id == user_id).first()
            project.users.remove(user)
            return True


    @jsonrpc_api.dispatcher.add_method
    def get_all_project_data(id: int): # pylint: disable=unused-variable
        return {
            'project': get_projects(id)[id],
            'issues': get_issues(id),
            'time_entries': get_time_entries(id),
            'users': get_project_users(id),
            'payments': get_payments(id),
            'tokens': get_project_tokens(id),
        }

    @jsonrpc_api.dispatcher.add_method
    def ping(): # pylint: disable=unused-variable
        return 1/0
