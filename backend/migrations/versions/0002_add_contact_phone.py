"""Add a mobile number to contact submissions."""
from alembic import op
import sqlalchemy as sa


revision = "0002_add_contact_phone"
down_revision = "0001_admin_postgres"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "contact_submissions",
        sa.Column("phone", sa.String(length=32), nullable=False, server_default=""),
    )
    op.alter_column("contact_submissions", "phone", server_default=None)


def downgrade() -> None:
    op.drop_column("contact_submissions", "phone")
