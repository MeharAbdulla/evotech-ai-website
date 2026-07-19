from app.database import db_manager
from app.auth.hash import hash_password


async def create_admin_user(
    username: str = "admin",
    password: str = "admin123",
    force_reset: bool = False,
):
    db = db_manager.db

    if db is None:
        raise Exception("Database not connected. Run through FastAPI lifespan or fix connection.")

    existing_user = await db.users.find_one({"username": username})

    if existing_user and not force_reset:
        print(f"User '{username}' already exists")
        return

    hashed = hash_password(password)

    if existing_user and force_reset:
        await db.users.update_one(
            {"username": username},
            {"$set": {"password": hashed, "role": "admin"}},
        )
        print(f"Password reset for '{username}'")
        return

    await db.users.insert_one(
        {
            "username": username,
            "password": hashed,
            "role": "admin",
        }
    )
    print(f"Admin user '{username}' created successfully")
