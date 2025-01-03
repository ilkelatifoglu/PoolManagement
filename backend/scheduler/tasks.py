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

def check_membership_expiration():
    """
    Checks for expired memberships:
    1. Updates swimmer's is_member status to 0
    2. Deletes expired membership records from the has table
    """
    try:
        cursor = mysql.get_db().cursor()
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        # Add debug logging
        print(f"Running membership check for date: {current_date}")
        
        # First update swimmers' is_member status
        update_query = """
            UPDATE swimmer s
            JOIN has h ON s.swimmer_id = h.swimmer_id
            SET s.is_member = 0
            WHERE h.end_date < %s
            AND s.is_member = 1
        """
        
        # Then delete expired memberships from has table
        delete_query = """
            DELETE FROM has
            WHERE end_date < %s
        """
        
        cursor.execute(update_query, (current_date,))
        cursor.execute(delete_query, (current_date,))
        mysql.get_db().commit()
        cursor.close()
        
        print(f"Successfully updated membership statuses and cleaned has table for {current_date}")
        
        # Add result logging
        print(f"Successfully processed memberships. Affected rows: {cursor.rowcount}")
        
    except Exception as e:
        print(f"Error updating membership statuses: {str(e)}")
