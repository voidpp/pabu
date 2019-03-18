import logging
from datetime import datetime, timedelta
import random
import string

from flask import Flask, abort, request
from jsonrpc.backend.flask import JSONRPCAPI
from pytimeparse import parse

from pabu.db import Database
from pabu.auth import is_logged_in, get_user_id
from pabu.models import Project, User, Issue, association_table, TimeEntry, Payment, ProjectInvitationToken

logger = logging.getLogger(__name__)

def random_str(len: int):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(len))

def add_api_controllers(app: Flask, db: Database):

    jsonrpc_api = JSONRPCAPI()

    app.add_url_rule('/', 'api', jsonrpc_api.as_view(), methods=['POST'])

    def entry_stat_from_list(time_entries):
        stat = {
            'spent': 0,
            'lastEntry': 0,
        }
        for entry in time_entries:
            if entry.end and entry.end.timestamp() > stat['lastEntry']:
                stat['lastEntry'] = entry.end.timestamp()
            if entry.start.timestamp() > stat['lastEntry']:
                stat['lastEntry'] = entry.start.timestamp()
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
            'timeStat': entry_stat_from_list(project.time_entries),
            'issues': [i.id for i in project.issues],
            'paid': paid,
            'users': [u.id for u in project.users]
        }

    def issue_to_dict(issue: Issue):
        return {
            'id': issue.id,
            'name': issue.name,
            'desc': issue.desc,
            'projectId': issue.project_id,
            'timeStat': entry_stat_from_list(issue.time_entries),
            'timeEntries': [t.id for t in issue.time_entries],
        }

    def payment_to_dict(payment: Payment):
        return {
            'id': payment.id,
            'projectId': payment.project_id,
            'createdUserId': payment.created_user_id,
            'paidUserId': payment.paid_user_id,
            'amount': payment.amount,
            'time': payment.time.timestamp(),
            'note': payment.note,
        }

    def user_to_dict(user: User):
        return {
            'id': user.id,
            'name': user.name,
        }

    def project_token_to_dict(prj_token: ProjectInvitationToken):
        return {
            'id': prj_token.id,
            'token': prj_token.token,
            'projectId': prj_token.project_id,
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

    def check_project(project_id, conn):
        user_id = get_user_id()
        if conn.query(Project).join(association_table).join(User).filter(User.id == user_id).filter(Project.id == project_id).count() != 1:
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
            qs = conn.query(Project).outerjoin(Payment).join(association_table).join(User).filter(User.id == user_id).outerjoin(Issue)
            if id:
                qs = qs.filter(Project.id == id)
            data = {r.id: project_to_dict(r) for r in qs.all()}
        return data

    @jsonrpc_api.dispatcher.add_method
    def create_issue(name: str, desc: str, project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            user_id = get_user_id()
            check_project(project_id, conn)
            issue = Issue(name = name, desc = desc, project_id = project_id, user_id = user_id)
            conn.add(issue)
            conn.flush()
            return issue_to_dict(issue)


    @jsonrpc_api.dispatcher.add_method
    def update_issue(id: int, name: str, desc: str, project_id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            issue = conn.query(Issue).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(Issue.id == id).first()
            if not issue:
                abort(404)
            issue.name = name
            issue.desc = desc
            # update project_id is not supported yet
            return issue_to_dict(issue)

    @jsonrpc_api.dispatcher.add_method
    def get_issues(project_id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            rows = conn.query(Issue).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(Project.id == project_id).all()
            return {r.id: issue_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def get_time_entries(project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            rows = conn.query(TimeEntry).filter(Project.id == project_id).all()
            return {r.id: time_entry_to_dict(r) for r in rows}

    @jsonrpc_api.dispatcher.add_method
    def add_time(project_id: int, amount: str, issue_id = None, end = None): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            check_project(project_id, conn)
            seconds = parse(amount)
            if not end:
                end = datetime.now()
            start = end - timedelta(seconds = seconds)
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
                return True
            return False

    def time_entry_to_dict(time_entry: TimeEntry):
        return {
            'id': time_entry.id,
            'issueId': time_entry.issue_id,
            'projectId': time_entry.project_id,
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
    def add_payment(project_id: int, amount: str, paid_user_id: int, note: str): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            check_project(project_id, conn)
            payment = Payment(project_id = project_id, amount = parse(amount), paid_user_id = paid_user_id, created_user_id = user_id,
                              note = note)
            conn.add(payment)
            return True

    @jsonrpc_api.dispatcher.add_method
    def get_project_users(project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            rows = conn.query(User).join(association_table).join(Project).filter(Project.id == project_id).all()
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
            issue = conn.query(Issue).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(Issue.id == id).first()
            if not issue:
                abort(404)
            conn.delete(issue)
            return True

    @jsonrpc_api.dispatcher.add_method
    def delete_time_entry(id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(TimeEntry).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(TimeEntry.id == id)
            entry = qs.first()
            if not entry:
                abort(404)
            conn.delete(entry)
            return True

    @jsonrpc_api.dispatcher.add_method
    def delete_payment(id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(Payment).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(Payment.id == id)
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
            qs = conn.query(ProjectInvitationToken).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(ProjectInvitationToken.id == id)
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
    def ping(): # pylint: disable=unused-variable
        return 1/0
