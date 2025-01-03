from database.connection import get_db
import pymysql
from datetime import datetime

def create_event(event_data, manager_id):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Verify pool belongs to the manager
            pool_query = """
            SELECT pool_id FROM pool WHERE pool_id = %(pool_id)s AND manager_id = %(manager_id)s
            """
            cursor.execute(pool_query, {"pool_id": event_data["pool_id"], "manager_id": manager_id})
            pool = cursor.fetchone()

            if not pool:
                raise Exception("You are not authorized to create events for this pool.")

            # Check if session already exists
            session_query = """
            SELECT session_id FROM session 
            WHERE date = %(date)s AND start_time = %(start_time)s AND end_time = %(end_time)s
            """
            cursor.execute(session_query, event_data)
            session = cursor.fetchone()

            if session:
                session_id = session["session_id"]
            else:
                # Create a new session
                new_session_query = """
                INSERT INTO session (date, start_time, end_time) 
                VALUES (%(date)s, %(start_time)s, %(end_time)s)
                """
                cursor.execute(new_session_query, event_data)
                session_id = cursor.lastrowid

            # Insert the event
            event_query = """
            INSERT INTO event (manager_id, event_name, event_type, capacity)
            VALUES (%(manager_id)s, %(event_name)s, %(event_type)s, %(capacity)s)
            """
            event_data["manager_id"] = manager_id
            cursor.execute(event_query, event_data)
            event_id = cursor.lastrowid

            # Link event to session and pool
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


def fetch_manager_pools(manager_id):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
            SELECT pool_id, name FROM pool WHERE manager_id = %s
            """
            cursor.execute(query, (manager_id,))
            pools = cursor.fetchall()
            return pools
    except Exception as e:
        raise Exception(f"Error fetching pools: {e}")



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
                p.name AS pool_name,
                COUNT(a.swimmer_id) as current_attendees
            FROM event e
            JOIN event_session es ON e.event_id = es.event_id
            JOIN session s ON es.session_id = s.session_id
            JOIN pool p ON es.pool_id = p.pool_id
            LEFT JOIN attends a ON e.event_id = a.event_id
            JOIN has h ON h.swimmer_id = %s
            JOIN membership m ON h.membership_id = m.membership_id
            WHERE e.status = 'READY' 
            AND es.pool_id = m.pool_id
            AND NOT EXISTS (
                SELECT 1 FROM attends a2 
                WHERE a2.event_id = e.event_id 
                AND a2.swimmer_id = %s
            )
            GROUP BY e.event_id
            HAVING current_attendees < e.capacity
            """
            cursor.execute(query, (swimmer_id, swimmer_id))
            results = cursor.fetchall()
            return results
    except Exception as e:
        print(f"Error in fetch_ready_events: {str(e)}")
        raise Exception(f"Error fetching ready events: {e}")

def add_attendance(swimmer_id, event_id):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Check if swimmer has a valid membership
            check_membership_query = """
            SELECT h.membership_id, m.pool_id 
            FROM has h
            JOIN membership m ON h.membership_id = m.membership_id
            WHERE h.swimmer_id = %s
            """
            cursor.execute(check_membership_query, (swimmer_id,))
            membership = cursor.fetchone()

            if not membership:
                raise Exception("You need a membership to attend events.")

            # Check if event is in an accessible pool
            check_pool_access_query = """
            SELECT es.pool_id
            FROM event_session es
            WHERE es.event_id = %s
            """
            cursor.execute(check_pool_access_query, (event_id,))
            event_pool = cursor.fetchone()
            
            if event_pool['pool_id'] != membership['pool_id']:
                raise Exception("You don't have access to this pool.")

            # Check event capacity
            check_capacity_query = """
            SELECT e.capacity, COUNT(a.swimmer_id) as current_attendees
            FROM event e
            LEFT JOIN attends a ON e.event_id = a.event_id
            WHERE e.event_id = %s
            GROUP BY e.event_id, e.capacity
            """
            cursor.execute(check_capacity_query, (event_id,))
            capacity_info = cursor.fetchone()
            
            if capacity_info['current_attendees'] >= capacity_info['capacity']:
                raise Exception("Event has reached maximum capacity.")

            # Add attendance if all checks pass
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
        raise Exception(f"Error adding attendance: {str(e)}")

def cancel_event(event_id):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            query = """
                UPDATE event
                SET status = 'CANCELLED'
                WHERE event_id = %s
            """
            print(f"Executing query for event_id: {event_id}")
            cursor.execute(query, (event_id,))
            conn.commit()
    except Exception as e:
        print(f"Error in cancel_class: {str(e)}")
        conn.rollback()
        raise Exception(f"Error cancelling class: {e}")

def fetch_all_ready_events():
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
            WHERE e.status = 'READY'
            """
            cursor.execute(query)
            results = cursor.fetchall()
            return results
    except Exception as e:
        raise Exception(f"Error fetching all ready events: {e}")

def fetch_event_types():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            query = """
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'event' AND COLUMN_NAME = 'event_type'
            """
            cursor.execute(query)
            result = cursor.fetchone()
            if result:
                enum_values = (
                    result[0]
                    .replace("enum(", "")
                    .replace(")", "")
                    .replace("'", "")
                    .split(",")
                )
                return enum_values
            else:
                raise Exception("No enum values found for event_type.")
    except Exception as e:
        raise Exception(f"Error fetching event types: {e}")
