from database.queries.pool_queries import fetch_pools
from database.connection import get_cursor
from database.queries.pool_queries import GET_POOLS_WITH_AVAILABLE_SESSIONS
from database.queries.session_queries import GET_AVAILABLE_SESSIONS

def get_all_pools():
    return fetch_pools()

class PoolService:
    
    @staticmethod
    def get_pools_with_available_sessions():
        try:
            cursor = get_cursor()
            print("Fetching pools with available sessions...")
            cursor.execute(GET_POOLS_WITH_AVAILABLE_SESSIONS)
            pools = cursor.fetchall()
            print(f"Pools with available sessions fetched: {pools}")
            return pools
        except Exception as e:
            print(f"Error fetching pools with available sessions: {e}")
            raise Exception(f"Error fetching pools with available sessions: {e}")

    @staticmethod
    def get_sessions_with_available_lanes(pool_id):
        try:
            cursor = get_cursor()
            print(f"Fetching sessions with available lanes for pool_id: {pool_id}...")
            # Pass pool_id as a parameter to the query
            cursor.execute(GET_AVAILABLE_SESSIONS, (pool_id,))
            sessions = cursor.fetchall()
            print(f"Sessions with available lanes fetched: {sessions}")
            return sessions
        except Exception as e:
            print(f"Error fetching sessions with available lanes: {e}")
            raise Exception(f"Error fetching sessions with available lanes: {e}")
