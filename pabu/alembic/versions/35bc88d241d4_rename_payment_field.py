"""rename payment field

Revision ID: 35bc88d241d4
Revises: 28e55086b76c
Create Date: 2019-03-17 20:59:02.186415

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '35bc88d241d4'
down_revision = '28e55086b76c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('payments', sa.Column('created_user_id', sa.Integer(), nullable=False))
    op.drop_constraint('payments_payer_user_id_fkey', 'payments', type_='foreignkey')
    op.create_foreign_key(None, 'payments', 'users', ['created_user_id'], ['id'], ondelete='CASCADE')
    op.drop_column('payments', 'payer_user_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('payments', sa.Column('payer_user_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'payments', type_='foreignkey')
    op.create_foreign_key('payments_payer_user_id_fkey', 'payments', 'users', ['payer_user_id'], ['id'], ondelete='CASCADE')
    op.drop_column('payments', 'created_user_id')
    # ### end Alembic commands ###
