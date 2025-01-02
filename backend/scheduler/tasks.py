from datetime import datetime, timedelta
from database.connection import mysql

def update_session_status():
    """
    Updates the status of bookings to 'DONE' for sessions that occurred yesterday
    """
    try:
        cursor = mysql.get_db().cursor()
        
        # Get yesterday's date
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        
        # Update booking status to 'DONE' where:
        # 1. Session date was yesterday
        # 2. Current status is 'READY'
        query = """
            UPDATE booking b
            JOIN session s ON b.session_id = s.session_id
            SET b.status = 'DONE'
            WHERE DATE(s.date) = %s
            AND b.status = 'READY'
        """
        
        cursor.execute(query, (yesterday,))
        mysql.get_db().commit()
        cursor.close()
        
        print(f"Successfully updated session statuses for {yesterday}")
        
    except Exception as e:
        print(f"Error updating session statuses: {str(e)}")
