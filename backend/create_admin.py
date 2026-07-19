import asyncio
import sys

from app.database import db_manager
from app.services.user_service import create_admin_user


async def run():
    username = sys.argv[1] if len(sys.argv) > 1 else "Murtaza"
    password = sys.argv[2] if len(sys.argv) > 2 else "murtaza@193686"
    force = "--force" in sys.argv or True

    await db_manager.connect_to_database()
    await create_admin_user(username=username, password=password, force_reset=force)
    await db_manager.close_database_connection()


if __name__ == "__main__":
    asyncio.run(run())
