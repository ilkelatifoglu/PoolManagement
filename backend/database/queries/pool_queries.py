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
