from database.connection import get_db
import pymysql


def create_class(class_data):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Step 1: Check if the session already exists
            session_query = """
            SELECT session_id FROM session 
            WHERE date = %(session_date)s AND start_time = %(start_time)s AND end_time = %(end_time)s
            """
            cursor.execute(session_query, class_data)
            session = cursor.fetchone()

            if session:
                session_id = session['session_id']
            else:
                # Step 2: Insert a new session
                new_session_query = """
                INSERT INTO session (date, start_time, end_time) 
                VALUES (%(session_date)s, %(start_time)s, %(end_time)s)
                """
                cursor.execute(new_session_query, class_data)
                session_id = cursor.lastrowid

            # Update session_id in class_data
            class_data['session_id'] = session_id

            # Step 3: Insert a new booking
            booking_query = """
            INSERT INTO booking (session_id, lane_number, pool_id, status)
            VALUES (%(session_id)s, %(lane_number)s, %(pool_id)s, 'Pending')
            """
            cursor.execute(booking_query, class_data)
            booking_id = cursor.lastrowid

            # Step 4: Insert the class entry
            # Update Step 4: Insert the class entry
            class_query = """
            INSERT INTO class (class_id, name, coach_id, level, age_req, gender_req, capacity, avg_rating, course_content, enroll_deadline, price)
            VALUES (%(booking_id)s, %(name)s, %(coach_id)s, %(level)s, %(age_req)s, %(gender_req)s, %(capacity)s, %(avg_rating)s, %(course_content)s, %(enroll_deadline)s, %(price)s)
            """

            class_data['booking_id'] = booking_id
            cursor.execute(class_query, class_data)

            conn.commit()
    except Exception as e:
        conn.rollback()
        raise Exception(f"Error inserting class: {e}")


# Query to fetch all available classes
def get_filtered_classes_query(filters):
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            query = """
                SELECT 
                    c.class_id, 
                    c.name AS class_name, 
                    c.level, 
                    c.age_req, 
                    c.gender_req, 
                    c.capacity, 
                    c.price, 
                    c.enroll_deadline, 
                    p.name AS pool_name, 
                    u.name AS coach_name, 
                    s.date AS session_date, 
                    CONCAT(TIME_FORMAT(s.start_time, '%%H:%%i'), ' - ', TIME_FORMAT(s.end_time, '%%H:%%i')) AS session_time, 
                    l.lane_number AS lane_number
                FROM 
                    class c
                JOIN 
                    booking b ON c.class_id = b.booking_id
                JOIN 
                    session s ON b.session_id = s.session_id
                JOIN 
                    lane l ON b.lane_number = l.lane_number AND b.pool_id = l.pool_id
                JOIN 
                    pool p ON b.pool_id = p.pool_id
                JOIN 
                    user u ON c.coach_id = u.user_id
                WHERE 
                    1=1
            """
            conditions = []
            params = {}

            # Apply filters dynamically
            if 'name' in filters:
                conditions.append("c.name LIKE %(name)s")
                params['name'] = f"%{filters['name']}%"
            if 'level' in filters:
                conditions.append("c.level = %(level)s")
                params['level'] = filters['level']
            if 'gender_req' in filters:
                conditions.append("c.gender_req = %(gender_req)s")
                params['gender_req'] = filters['gender_req']
            if 'pool_name' in filters:
                conditions.append("p.name LIKE %(pool_name)s")
                params['pool_name'] = f"%{filters['pool_name']}%"
            if 'coach_name' in filters:
                conditions.append("u.name LIKE %(coach_name)s")
                params['coach_name'] = f"%{filters['coach_name']}%"
            if 'date' in filters:
                conditions.append("DATE(s.date) = %(date)s")
                params['date'] = filters['date']

            if conditions:
                query += " AND " + " AND ".join(conditions)

            query += " ORDER BY s.date ASC, s.start_time ASC"

            print("Query to execute:", query)
            print("With parameters:", params)
            
            cursor.execute(query, params)
            return cursor.fetchall()
    except Exception as e:
        raise Exception(f"Error fetching classes: {e}")
    
def fetch_classes():
    query = """
    SELECT 
        c.class_id, c.name, c.level, c.age_req, c.gender_req, c.capacity, 
        c.avg_rating, c.course_content, c.enroll_deadline, u.name AS coach_name
    FROM 
        class c
    INNER JOIN 
        user u ON u.user_id = c.coach_id
    """
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(query)
            return cursor.fetchall()
    except Exception as e:
        raise Exception(f"Error fetching classes: {e}")


def add_class_to_cart_query(data):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            query = """
                INSERT INTO schedules (swimmer_id, class_id, is_paid)
                VALUES (%(swimmer_id)s, %(class_id)s, 0)
            """
            print(f"Executing query: {query} with data: {data}")  # Debug log
            cursor.execute(query, data)
            conn.commit()
    except pymysql.err.IntegrityError as e:
        conn.rollback()
        raise Exception(f"Integrity error: {e}")  # Handles foreign key constraint issues
    except Exception as e:
        conn.rollback()
        raise Exception(f"Error adding to cart: {e}")  # Handles other exceptions
