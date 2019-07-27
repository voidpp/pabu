
from .db import Database
from .models import Source, Project

def handle_gitlab_issue_hook(data: dict, source: Source, conn):
    action = data['object_attributes']['action']

    # name          ok
    # desc          ok
    # project_id    ok
    # reporter_id   ????
    # assignee_id   ok (-ish, can be null (in case of unknown user))
    # status        ok
    # rank          -
    # status_date   ok

    pass
