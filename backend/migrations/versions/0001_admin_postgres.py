"""Create portfolio admin tables."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_admin_postgres"
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table("projects", sa.Column("id", sa.String(120), primary_key=True), sa.Column("title", sa.String(160), nullable=False), sa.Column("problem", sa.Text(), nullable=False), sa.Column("solution", sa.Text(), nullable=False), sa.Column("result", sa.Text(), nullable=False), sa.Column("tech", postgresql.JSONB(), nullable=False), sa.Column("github_url", sa.String(500), nullable=False), sa.Column("live_url", sa.String(500), nullable=False, server_default=""), sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.true()), sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"))
    op.create_table("contact_submissions", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(100), nullable=False), sa.Column("email", sa.String(320), nullable=False), sa.Column("message", sa.Text(), nullable=False), sa.Column("status", sa.String(16), nullable=False, server_default="new"), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_table("site_content", sa.Column("key", sa.String(64), primary_key=True), sa.Column("value", postgresql.JSONB(), nullable=False))
    op.create_index("ix_projects_sort_order", "projects", ["sort_order"]); op.create_index("ix_contact_submissions_status", "contact_submissions", ["status"])

def downgrade() -> None:
    op.drop_table("site_content"); op.drop_table("contact_submissions"); op.drop_table("projects")
