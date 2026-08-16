import sys
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool

# Alembic runs this file from its migration directory on Render.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from database import Base
from main import settings

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url or config.get_main_option("sqlalchemy.url"))
target_metadata = Base.metadata


def run_migrations_online() -> None:
    connectable = engine_from_config(config.get_section(config.config_ini_section), prefix="sqlalchemy.", poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction(): context.run_migrations()


run_migrations_online()
