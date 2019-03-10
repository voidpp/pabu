import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, Enum, JSON, DateTime, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()

association_table = Table('projects_users', Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    sub = Column(String, nullable = False)
    email = Column(String)

class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable = False)
    desc = Column(String)

    users = relationship("User", secondary = association_table)

class SourceType(enum.Enum):

    GITLAB = 'gitlab'

class Source(Base):
    __tablename__ = 'sources'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable = False)
    type = Column(Enum(SourceType), nullable = False)
    config = Column(JSON, nullable = False)

class Issue(Base):
    __tablename__ = 'issues'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable = False)
    desc = Column(String, default = '')
    project_id = Column(Integer, ForeignKey('projects.id'), nullable = False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable = False)

class TimeEntry(Base):
    __tablename__ = 'time_entries'

    id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, ForeignKey('issues.id'))
    project_id = Column(Integer, ForeignKey('projects.id'), nullable = False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable = False)
    start = Column(DateTime, default = datetime.now)
    end = Column(DateTime)

