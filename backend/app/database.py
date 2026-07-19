import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class DatabaseManager:
    def __init__(self):
        self.client: AsyncIOMotorClient = None
        self.db = None

    async def connect_to_database(self):
        """
        Initializes the MongoDB Async Client pool.
        Called during application startup and lazily on first use
        (so it also works in serverless environments where the ASGI
        lifespan startup event may not run, e.g. Vercel functions).
        """
        if self.db is not None:
            return
        try:
            logger.info("Connecting to MongoDB...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                # Keep the pool small — serverless favours short-lived, low-count connections
                maxPoolSize=10,
                minPoolSize=0,
                serverSelectionTimeoutMS=10000,
                uuidRepresentation="standard"
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            logger.info(f"MongoDB client initialised for database: '{settings.MONGODB_DB_NAME}'")
        except Exception as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise e

    async def close_database_connection(self):
        """
        Closes the MongoDB Async Client pool cleanly.
        Called during application shutdown.
        """
        if self.client:
            logger.info("Closing connection to MongoDB...")
            self.client.close()
            logger.info("MongoDB connection closed safely.")

# Singleton instance to be used across routes and services
db_manager = DatabaseManager()

async def get_database():
    """
    Dependency helper to retrieve the active database instance.
    Lazily establishes the connection on first use so the app works
    both under uvicorn (lifespan) and under serverless (no lifespan).
    """
    if db_manager.db is None:
        await db_manager.connect_to_database()
    return db_manager.db