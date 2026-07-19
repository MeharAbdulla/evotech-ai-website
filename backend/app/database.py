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
        Called during application startup.
        """
        try:
            logger.info("Connecting to MongoDB...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                # Production pool configurations
                maxPoolSize=100,
                minPoolSize=10,
                uuidRepresentation="standard"
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            
            # Verify connection by pinging the server
            await self.client.admin.command('ping')
            logger.info(f"Successfully connected to MongoDB database: '{settings.MONGODB_DB_NAME}'")
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

def get_database():
    """
    Dependency helper function to retrieve the active database instance.
    """
    return db_manager.db