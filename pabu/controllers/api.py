from flask import Flask, abort
from jsonrpc.backend.flask import api

from pabu.auth import is_logged_in

def add_api_controllers(app: Flask):

    app.add_url_rule('/', 'api', api.as_view(), methods=['POST'])

    @app.before_request
    def check_login():
        if not is_logged_in():
            abort(401)

    @api.dispatcher.add_method
    def my_method(muha):
        return muha*2
