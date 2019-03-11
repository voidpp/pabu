from flask import Flask, abort
from jsonrpc.backend.flask import api

from pabu.db import Database
from pabu.auth import is_logged_in, get_user_id
from pabu.models import Project, User

def add_api_controllers(app: Flask, db: Database):

    app.add_url_rule('/', 'api', api.as_view(), methods=['POST'])

    def get_current_user(conn):
        user_id = get_user_id()
        return conn.query(User).filter(User.id == user_id).first()

    @app.before_request
    def check_login(): # pylint: disable=unused-variable
        if not is_logged_in():
            abort(401)

    @api.dispatcher.add_method
    def create_project(name: str, desc: str): # pylint: disable=unused-variable
        with db.session_scope() as conn:
            prj = Project(name = name, desc = desc, users = [get_current_user(conn)])
            conn.add(prj)
            conn.flush()
            return prj.id

    @api.dispatcher.add_method
    def get_project_list(): # pylint: disable=unused-variable
        user_id = get_user_id()
        data = []
        with db.session_scope() as conn:
            data = [{'id': r.id, 'name': r.name, 'desc': r.desc} for r in conn.query(Project).filter(User.id == user_id).all()]
        return data

    @api.dispatcher.add_method
    def ping(): # pylint: disable=unused-variable
        return 1/0
