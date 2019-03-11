from flask import Flask, abort
from jsonrpc.backend.flask import api

from pabu.db import Database
from pabu.auth import is_logged_in, get_user_id
from pabu.models import Project, User, Issue, association_table, TimeEntry

def add_api_controllers(app: Flask, db: Database):

    app.add_url_rule('/', 'api', api.as_view(), methods=['POST'])

    def project_to_dict(project: Project):
        return {
            'id': project.id,
            'name': project.name,
            'desc': project.desc,
            'issues': len(project.issues),
        }

    def get_current_user(conn):
        user_id = get_user_id()
        return conn.query(User).filter(User.id == user_id).first()

    @app.before_request
    def check_login(): # pylint: disable=unused-variable
        if not is_logged_in():
            abort(401)

    def check_project(project_id, conn):
        user_id = get_user_id()
        if conn.query(Project).join(association_table).filter(User.id == user_id).filter(Project.id == project_id).count() != 1:
            abort(404)

    @api.dispatcher.add_method
    def create_project(name: str, desc: str): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            prj = Project(name = name, desc = desc, users = [get_current_user(conn)])
            conn.add(prj)
            conn.flush()
            return project_to_dict(prj)

    @api.dispatcher.add_method
    def get_projects(id: int = None): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            qs = conn.query(Project).filter(User.id == user_id).join(association_table).outerjoin(Issue)
            if id:
                qs = qs.filter(Project.id == id)
            data = {r.id: project_to_dict(r) for r in qs.all()}
        return data

    @api.dispatcher.add_method
    def create_issue(name: str, desc: str, project_id: int): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            user_id = get_user_id()
            check_project(project_id, conn)
            issue = Issue(name = name, desc = desc, project_id = project_id, user_id = user_id)
            conn.add(issue)
            conn.flush()
            return issue.id

    @api.dispatcher.add_method
    def get_issues(project_id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            rows = conn.query(Issue).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(Project.id == project_id).all()
            return [{'id': r.id, 'name': r.name} for r in rows]

    @api.dispatcher.add_method
    def get_time_summary(project_id: int): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            rows = conn.query(TimeEntry).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(Project.id == project_id).all()
            return [{'id': r.id, 'name': r.name} for r in rows]

    @api.dispatcher.add_method
    def add_time(project_id, start, issue_id = None, end = None): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            check_project(project_id, conn)
            entry = TimeEntry(project_id = project_id, issue_id = issue_id, start = start, end = end)
            conn.add(entry)

    @api.dispatcher.add_method
    def finish_time(time_id, time): # pylint: disable=unused-variable
        user_id = get_user_id()
        with db.session_scope() as conn:
            entry = conn.query(TimeEntry).join(Project).join(association_table).join(User).filter(User.id == user_id).filter(TimeEntry.id == time_id).first()
            if not entry:
                abort(404)
            entry.end = time

    @api.dispatcher.add_method
    def ping(): # pylint: disable=unused-variable
        return 1/0
