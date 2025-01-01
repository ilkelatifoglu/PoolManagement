from database.connection import get_db
import pymysql

def create_event(event_data):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Insert event
            event_query = """
            INSERT INTO event (manager_id, event_name, event_type, capacity)
            VALUES (%(manager_id)s, %(event_name)s, %(event_type)s, %(capacity)s)
            """
            cursor.execute(event_query, event_data)
            event_id = cursor.lastrowid  # Fetch last inserted event ID

            # Insert session
            session_query = """
            INSERT INTO session (date, start_time, end_time)
            VALUES (%(date)s, %(start_time)s, %(end_time)s)
            """
            cursor.execute(session_query, event_data)
            session_id = cursor.lastrowid  # Fetch last inserted session ID

            # Map event to session
            event_session_query = """
            INSERT INTO event_session (event_id, session_id, pool_id)
            VALUES (%(event_id)s, %(session_id)s, %(pool_id)s)
            """
            cursor.execute(event_session_query, {
                "event_id": event_id,
                "session_id": session_id,
                "pool_id": event_data["pool_id"]
            })

            conn.commit()
    except Exception as e:
        conn.rollback()
        raise Exception(f"Error creating event: {e}")
