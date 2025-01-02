from database.connection import get_db
import pymysql
from datetime import datetime, timedelta

def create_event(event_data):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Step 1: Check if the session already exists
            session_query = """
            SELECT session_id FROM session 
            WHERE date = %(date)s AND start_time = %(start_time)s AND end_time = %(end_time)s
            """
            cursor.execute(session_query, event_data)
            session = cursor.fetchone()

            if session:
                session_id = session['session_id']
            else:
                # Step 2: Insert a new session
                new_session_query = """
                INSERT INTO session (date, start_time, end_time) 
                VALUES (%(date)s, %(start_time)s, %(end_time)s)
                """
                cursor.execute(new_session_query, event_data)
                session_id = cursor.lastrowid  # Fetch last inserted session ID

            # Step 3: Insert the event entry
            event_query = """
            INSERT INTO event (manager_id, event_name, event_type, capacity)
            VALUES (%(manager_id)s, %(event_name)s, %(event_type)s, %(capacity)s)
            """
            cursor.execute(event_query, event_data)
            event_id = cursor.lastrowid  # Fetch last inserted event ID

            # Step 4: Map event to session
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



def fetch_ready_events(swimmer_id):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
            SELECT 
                e.event_id, 
                e.event_name, 
                e.event_type, 
                e.capacity, 
                e.status,
                s.date AS session_date, 
                CONCAT(TIME_FORMAT(s.start_time, '%%H:%%i'), ' - ', TIME_FORMAT(s.end_time, '%%H:%%i')) AS session_time, 
                p.name AS pool_name
            FROM event e
            JOIN event_session es ON e.event_id = es.event_id
            JOIN session s ON es.session_id = s.session_id
            JOIN pool p ON es.pool_id = p.pool_id
            LEFT JOIN attends a ON e.event_id = a.event_id AND a.swimmer_id = %s
            WHERE e.status = 'READY' AND a.event_id IS NULL
            """
            print(f"Executing query for swimmer_id: {swimmer_id}")  # Debugging log
            cursor.execute(query, (swimmer_id,))
            results = cursor.fetchall()
            print(f"Query results: {results}")  # Debugging log
            return results
    except Exception as e:
        print(f"Error in fetch_ready_events: {str(e)}")  # Debugging log
        raise Exception(f"Error fetching ready events: {e}")

def add_attendance(swimmer_id, event_id):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Check if swimmer has a valid membership
            check_membership_query = """
            SELECT membership_id FROM has WHERE swimmer_id = %s
            """
            cursor.execute(check_membership_query, (swimmer_id,))
            membership = cursor.fetchone()

            if not membership:
                raise Exception("You need a membership to attend events.")

            # Check if already registered
            query = """
            INSERT INTO attends (swimmer_id, event_id)
            VALUES (%s, %s)
            """
            cursor.execute(query, (swimmer_id, event_id))
            conn.commit()
    except pymysql.err.IntegrityError:
        raise Exception("You have already registered for this event.")
    except Exception as e:
        conn.rollback()
        raise Exception(f"Error adding attendance: {e}")

