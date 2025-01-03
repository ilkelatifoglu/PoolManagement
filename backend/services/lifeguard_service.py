from database.connection import get_cursor
from database.queries.lifeguard_queries import *

class LifeguardService:
    @staticmethod
    def get_all_schedules():
        try:
            cursor = get_cursor()
            # Add debug logging
            print("Executing get_all_lifeguard_schedules query")
            cursor.execute(GET_ALL_LIFEGUARD_SCHEDULES)
            schedules = cursor.fetchall()
            
            # Add debug logging
            print(f"Retrieved {len(schedules)} schedule records")
            
            formatted_schedules = {}
            for schedule in schedules:
                lifeguard_id = schedule['user_id']
                if lifeguard_id not in formatted_schedules:
                    formatted_schedules[lifeguard_id] = {
                        'name': schedule['name'],
                        'schedule': {}
                    }
                
                day = schedule['day_of_week']
                if day not in formatted_schedules[lifeguard_id]['schedule']:
                    formatted_schedules[lifeguard_id]['schedule'][day] = {}
                
                time = schedule['time_slot']
                time_str = time.strftime('%H:00') if hasattr(time, 'strftime') else f"{time}:00"
                formatted_schedules[lifeguard_id]['schedule'][day][time_str] = schedule['is_available']
            
            return formatted_schedules
            
        except Exception as e:
            print(f"Error in get_all_schedules: {str(e)}")
            import traceback
            print(traceback.format_exc())
            raise

    @staticmethod
    def get_all_lifeguards():
        try:
            cursor = get_cursor()
            # Add debug logging
            print("Executing get_all_lifeguards query")
            cursor.execute(GET_ALL_LIFEGUARDS)
            lifeguards = cursor.fetchall()
            # Add debug logging
            print(f"Retrieved {len(lifeguards)} lifeguard records")
            return lifeguards
        except Exception as e:
            print(f"Error in get_all_lifeguards: {str(e)}")
            import traceback
            print(traceback.format_exc())
            raise 