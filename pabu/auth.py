
from flask import session
from loginpass import Google, Twitter, Facebook, GitHub, Dropbox, Reddit, Gitlab, Slack, Discord, Bitbucket, Spotify, Twitch

backends = (Google, Twitter, Facebook, GitHub, Dropbox, Reddit, Gitlab, Slack, Discord, Bitbucket, Spotify, Twitch)

def is_logged_in():
    return 'user_info' in session
