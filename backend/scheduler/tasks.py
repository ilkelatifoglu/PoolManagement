from datetime import datetime, timedelta
from database.connection import mysql

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

def update_past_activities_status():
    """
    Updates the status of past classes, trainings, and events from 'READY' to 'DONE'
    """
    try:
        cursor = mysql.get_db().cursor()
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        # Update class bookings
        class_query = """
            UPDATE booking b
            JOIN session s ON b.session_id = s.session_id
            SET b.status = 'DONE'
            WHERE DATE(s.date) < %s
            AND b.status = 'READY'
            AND EXISTS (SELECT 1 FROM class c WHERE c.class_id = s.class_id)
        """
        
        # Update training bookings
        training_query = """
            UPDATE booking b
            JOIN session s ON b.session_id = s.session_id
            SET b.status = 'DONE'
            WHERE DATE(s.date) < %s
            AND b.status = 'READY'
            AND EXISTS (SELECT 1 FROM training t WHERE t.training_id = s.training_id)
        """
        
        # Update events
        event_query = """
            UPDATE event e
            JOIN session s ON e.event_id = s.event_id
            SET e.status = 'DONE'
            WHERE DATE(s.date) < %s
            AND e.status = 'READY'
        """
        
        cursor.execute(class_query, (current_date,))
        class_count = cursor.rowcount
        
        cursor.execute(training_query, (current_date,))
        training_count = cursor.rowcount
        
        cursor.execute(event_query, (current_date,))
        event_count = cursor.rowcount
        
        mysql.get_db().commit()
        cursor.close()
        
        print(f"Successfully updated past activities for {current_date}")
        print(f"Updated records: Classes: {class_count}, Trainings: {training_count}, Events: {event_count}")
        
    except Exception as e:
        print(f"Error updating past activities status: {str(e)}")
