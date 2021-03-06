"""add status_date to issue

Revision ID: 04115bd903c0
Revises: 6fffa1625c78
Create Date: 2019-03-25 19:35:58.977873

"""
from alembic import op
import sqlalchemy as sa
from pabu.tools import get_table
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '04115bd903c0'
down_revision = '6fffa1625c78'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('issues', sa.Column('status_date', sa.DateTime(), nullable=True))

    issues = get_table(op.get_bind(), 'issues')
    op.execute(issues.update().values(status_date = datetime.now()))

    op.alter_column('issues', 'status_date', nullable=False)

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('issues', 'status_date')
    # ### end Alembic commands ###
