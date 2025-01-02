from database.connection import get_db
import pymysql

def fetch_pools():
    query = "SELECT pool_id, name FROM pool"
    conn = get_db()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(query)
            return cursor.fetchall()  # Ensure data is returned in a list format
    except Exception as e:
        raise Exception(f"Error fetching pools: {e}")

GET_POOLS_WITH_AVAILABLE_SESSIONS = """
SELECT DISTINCT p.pool_id, p.name
FROM pool p
JOIN lane l ON p.pool_id = l.pool_id
WHERE EXISTS (
    SELECT 1
    FROM session s
    JOIN lane l2 ON l2.pool_id = p.pool_id
    LEFT JOIN booking b ON b.pool_id = l2.pool_id AND b.lane_number = l2.lane_number AND b.session_id = s.session_id
    WHERE b.status IS NULL OR b.status != 'READY'
)
"""
