from database.connection import get_db
import pymysql


from database.connection import get_db
import pymysql

def create_class(class_data, coach_id):
    conn = get_db()
    try:
        print("Creating class with data:", class_data)
        print("Coach ID:", coach_id)

        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Validate if the coach works in the given pool
            print("Validating pool association for coach")
            pool_query = """
            SELECT pool_id FROM coach 
            WHERE coach_id = %(coach_id)s AND pool_id = %(pool_id)s
            """
            cursor.execute(pool_query, {"pool_id": class_data["pool_id"], "coach_id": coach_id})
            pool = cursor.fetchone()
            print("Pool Query Result:", pool)

            if not pool:
                raise Exception("Unauthorized: You can only create classes in pools you are associated with.")
            
            print("Pool validated:", pool)
            
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

            # Step 3: Insert a new booking with status as 'READY'
            booking_query = """
            INSERT INTO booking (session_id, lane_number, pool_id, status)
            VALUES (%(session_id)s, %(lane_number)s, %(pool_id)s, 'READY')
            """
            cursor.execute(booking_query, {**class_data, "session_id": session_id})
            booking_id = cursor.lastrowid

            # Step 4: Insert the class entry
            class_query = """
            INSERT INTO class (
                class_id, name, coach_id, level, age_req, 
                gender_req, capacity, course_content, 
                enroll_deadline, price
            )
            VALUES (
                %(booking_id)s, %(name)s, %(coach_id)s, %(level)s, 
                %(age_req)s, %(gender_req)s, %(capacity)s, 
                %(course_content)s, %(enroll_deadline)s, %(price)s
            )
            """
            cursor.execute(class_query, {**class_data, "coach_id": coach_id, "booking_id": booking_id})

            conn.commit()
    except Exception as e:
        conn.rollback()
        raise Exception(f"Error inserting class: {e}")


# Query to fetch all available classes
def get_filtered_classes_query(filters, swimmer_id):
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
                    DATE_FORMAT(s.date, '%Y-%m-%d') AS session_date, 
                    TIME_FORMAT(s.start_time, '%H:%i') AS start_time,
                    TIME_FORMAT(s.end_time, '%H:%i') AS end_time,
                    TIMESTAMPDIFF(HOUR, s.start_time, s.end_time) AS duration, 
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
                LEFT JOIN 
                    schedules sch ON c.class_id = sch.class_id AND sch.swimmer_id = %(swimmer_id)s
                WHERE 
                    sch.class_id IS NULL
                ORDER BY 
                    s.date ASC, s.start_time ASC;

            """
            conditions = []
            params = {'swimmer_id': swimmer_id}

            # Add filters for start_time and end_time
            if 'start_time' in filters:
                conditions.append("TIME(s.start_time) >= TIME(%(start_time)s)")
                params['start_time'] = filters['start_time']
            if 'end_time' in filters:
                conditions.append("TIME(s.end_time) <= TIME(%(end_time)s)")
                params['end_time'] = filters['end_time']

            if conditions:
                query += " AND " + " AND ".join(conditions)

            query += " ORDER BY s.date ASC, s.start_time ASC"

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
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # First check if the enrollment deadline hasn't passed
            check_deadline_query = """
                SELECT enroll_deadline 
                FROM class 
                WHERE class_id = %(class_id)s 
                AND enroll_deadline >= CURDATE()
            """
            cursor.execute(check_deadline_query, data)
            deadline_check = cursor.fetchone()
            
            if not deadline_check:
                raise Exception("Enrollment deadline has passed for this class")

            # If deadline hasn't passed, proceed with insertion
            insert_query = """
                INSERT INTO schedules (swimmer_id, class_id, is_paid)
                VALUES (%(swimmer_id)s, %(class_id)s, 0)
            """
            cursor.execute(insert_query, data)
            conn.commit()
    except pymysql.err.IntegrityError as e:
        conn.rollback()
        raise Exception(f"Integrity error: {e}")
    except Exception as e:
        conn.rollback()
        raise Exception(str(e))
    
def get_unadded_classes(swimmer_id):
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
                DATE_FORMAT(s.date, '%%Y-%%m-%%d') AS session_date, -- Format date
                TIME_FORMAT(s.start_time, '%%H:%%i') AS start_time,
                TIME_FORMAT(s.end_time, '%%H:%%i') AS end_time,
                TIMESTAMPDIFF(HOUR, s.start_time, s.end_time) AS duration,
                l.lane_number AS lane_number,
                (SELECT COUNT(*) FROM schedules sch WHERE sch.class_id = c.class_id) AS occupied_places
            FROM
                class c
            JOIN
                booking b ON c.class_id = b.booking_id
            JOIN
                session s ON b.session_id = s.session_id
            JOIN
                pool p ON b.pool_id = p.pool_id
            JOIN
                user u ON c.coach_id = u.user_id
            LEFT JOIN
                schedules sch ON c.class_id = sch.class_id AND sch.swimmer_id = %(swimmer_id)s
            LEFT JOIN
                lane l ON b.lane_number = l.lane_number AND b.pool_id = l.pool_id
            WHERE
                sch.class_id IS NULL
                AND b.status = 'READY'  -- Filter classes with READY status
                AND (SELECT COUNT(*) FROM schedules sch WHERE sch.class_id = c.class_id) < c.capacity
            ORDER BY s.date ASC, s.start_time ASC
            """
            params = {'swimmer_id': swimmer_id}
            cursor.execute(query, params)
            return cursor.fetchall()
    except Exception as e:
        raise Exception(f"Error fetching classes not in cart: {e}")


def fetch_ready_classes():
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
                DATE_FORMAT(s.date, '%%a, %%d %%b %%Y') AS session_date, -- Format date to a readable format
                CONCAT(TIME_FORMAT(s.start_time, '%%H:%%i'), ' - ', TIME_FORMAT(s.end_time, '%%H:%%i')) AS session_time, -- Format time
                l.lane_number AS lane_number,
                b.status
            FROM
                class c
            JOIN
                booking b ON c.class_id = b.booking_id
            JOIN
                session s ON b.session_id = s.session_id
            JOIN
                pool p ON b.pool_id = p.pool_id
            JOIN
                user u ON c.coach_id = u.user_id
            LEFT JOIN
                lane l ON b.lane_number = l.lane_number AND b.pool_id = l.pool_id
            WHERE
                b.status = 'READY'
            ORDER BY s.date ASC, s.start_time ASC
            """
            cursor.execute(query)
            return cursor.fetchall()
    except Exception as e:
        print(f"Error fetching ready classes: {e}")
        raise Exception("Error fetching ready classes")



def cancel_class(class_id):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            query = """
                UPDATE booking
                SET status = 'CANCELLED'
                WHERE booking_id = %s
            """
            print(f"Executing query for class_id: {class_id}")
            cursor.execute(query, (class_id,))
            conn.commit()
    except Exception as e:
        print(f"Error in cancel_class: {str(e)}")
        conn.rollback()
        raise Exception(f"Error cancelling class: {e}")
