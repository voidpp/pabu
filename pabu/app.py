
from flask import Flask, render_template, session
from werkzeug.wsgi import DispatcherMiddleware

from .config import load
from .db import Database
from .models import User
from .controllers.api import add_api_controllers
from .controllers.auth import add_auth_controllers
from .auth import is_logged_in

frontent = Flask('pabu')
api = Flask('api')
auth = Flask('auth')

secret_key = 'j32bd4kj2d4jkvgh23jk4hvgj23hg4ekjhg'

frontent.secret_key = secret_key
auth.secret_key = secret_key
api.secret_key = secret_key

wsgi_application = DispatcherMiddleware(frontent, {
    '/api': api,
    '/auth': auth,
})

config = load()

for name, cfg in config.auth.items():
    auth.config[(name + '_client_id').upper()] = cfg.id
    auth.config[(name + '_client_secret').upper()] = cfg.secret


if not config:
    print('no config!')
    exit(1)

db = Database(str(config.database))

@frontent.route('/')
@frontent.route('/<path:path>')
def index(path = None):
    return render_template('index.html',
        data = {
            'userInfo': session.get('user_info'),
            'isLoggedIn': is_logged_in(),
            'authBackendNames': list(config.auth.keys()),
        }
    )

add_api_controllers(api, db)
add_auth_controllers(auth, config, db)
