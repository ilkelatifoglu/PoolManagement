from datetime import datetime, timedelta
from database.connection import get_cursor
from database.queries.session_queries import GET_ALL_SESSIONS, GET_AVAILABLE_SESSIONS

class SessionService:
    @staticmethod
    def get_all_sessions():
        try:
            cursor = get_cursor()
            print("Executing query to fetch sessions...")
            cursor.execute(GET_ALL_SESSIONS)
            sessions = cursor.fetchall()
            
            # Serialize datetime and timedelta objects
            for session in sessions:
                session['date'] = session['date']
                session['start_time'] = session['start_time']
                session['end_time'] = session['end_time']
            
            print(f"Sessions fetched: {sessions}")
            return [dict(session) for session in sessions]
        except Exception as e:
            print(f"Error in get_all_sessions: {e}")
            raise

    @staticmethod
    def get_available_sessions(pool_id):
        try:
            cursor = get_cursor()
            print("Executing query to fetch available sessions...")
            cursor.execute(GET_AVAILABLE_SESSIONS, (pool_id,))
            sessions = cursor.fetchall()
            
            # Serialize datetime and timedelta objects
            for session in sessions:
                session['date'] = session['date']  # Convert datetime to string
                session['start_time'] = str(session['start_time'])  # Convert timedelta to string
                session['end_time'] = str(session['end_time'])  # Convert timedelta to string
            
            print(f"Available sessions fetched: {sessions}")
            return [dict(session) for session in sessions]
        except Exception as e:
            print(f"Error in get_available_sessions: {e}")
            raise
