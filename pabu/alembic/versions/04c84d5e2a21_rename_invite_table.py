"""rename invite table

Revision ID: 04c84d5e2a21
Revises: 35bc88d241d4
Create Date: 2019-03-18 20:50:05.624146

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '04c84d5e2a21'
down_revision = '35bc88d241d4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('project_invitation_tokens',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('project_id', sa.Integer(), nullable=False),
    sa.Column('token', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('project_invitations')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('project_invitations',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('project_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('token', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['project_id'], ['projects.id'], name='project_invitations_project_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='project_invitations_pkey')
    )
    op.drop_table('project_invitation_tokens')
    # ### end Alembic commands ###
