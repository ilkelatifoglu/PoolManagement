from database.connection import get_cursor, commit_db
from database.queries.report_queries import *

class ReportService:
    @staticmethod
    def generate_system_report(administrator_id, date):
        cursor = get_cursor()
        try:
            # Fetch data for the report
            cursor.execute(GET_TOTAL_SWIMMER_COUNT)
            result = cursor.fetchone()
            total_swimmer_count = result['total_swimmer_count'] if result else 0

            cursor.execute(GET_TOTAL_MEMBER_COUNT)
            result = cursor.fetchone()
            total_member_count = result['total_member_count'] if result else 0

            cursor.execute(GET_DAILY_SELF_TRAINING_COUNT, (date,))
            result = cursor.fetchone()
            daily_self_training_count = result['daily_self_training_count'] if result else 0

            cursor.execute(GET_DAILY_TRAINING_COUNT, (date,))
            result = cursor.fetchone()
            daily_training_count = result['daily_training_count'] if result else 0

            cursor.execute(GET_DAILY_CLASS_COUNT, (date,))
            result = cursor.fetchone()
            daily_class_count = result['daily_class_count'] if result else 0

            cursor.execute(GET_DAILY_PEAK_HOURS, (date,))
            result = cursor.fetchone()
            if result:
                peak_start_time = result['start_time']
                peak_end_time = result['end_time']
            else:
                peak_start_time = None
                peak_end_time = None
            daily_peak_hours = f"{peak_start_time} - {peak_end_time}" if peak_start_time and peak_end_time else "N/A"

            cursor.execute(GET_AVERAGE_CANCELLATION_RATE)
            result = cursor.fetchone()
            avg_cancellation_rate = result['avg_cancellation_rate'] if result else 0.0

            cursor.execute(GET_AVG_EVENT_ATTENDANCE_RATE)
            result = cursor.fetchone()
            avg_event_attendance_rate = result['avg_event_attendance_rate'] if result else 0.0

            cursor.execute(GET_DAILY_REVENUE, (date,))
            result = cursor.fetchone()
            daily_revenue = result['daily_revenue'] if result else 0.0

            # Insert the system report
            cursor.execute(GENERATE_SYSTEM_REPORT, (
                administrator_id,
                date,
                daily_peak_hours,
                avg_cancellation_rate,
                daily_revenue,
                total_swimmer_count,
                total_member_count,
                daily_self_training_count,
                daily_training_count,
                daily_class_count,
                avg_event_attendance_rate,
            ))

            # Increment report count for the administrator
            cursor.execute(INCREMENT_REPORT_COUNT, (administrator_id,))

            commit_db()
            return "System report generated successfully."
        except Exception as e:
            print(f"Error generating system report for administrator_id={administrator_id}, date={date}: {e}")
            raise


    @staticmethod
    def get_system_reports(administrator_id):
        cursor = get_cursor()
        try:
            # Execute the query
            cursor.execute(GET_SYSTEM_REPORTS, (administrator_id,))

            # Fetch all reports
            reports = cursor.fetchall()

            return reports
        except Exception as e:
            print(f"Error fetching system reports: {e}")
            raise

    @staticmethod
    def delete_system_report(report_id):
        cursor = get_cursor()
        try:
            # Check if the report exists
            cursor.execute(CHECK_SYSTEM_REPORT, (report_id,))
            report = cursor.fetchone()

            if not report:
                return False  # Report not found

            administrator_id = report['administrator_id']  # Fetch the administrator ID from the report

            # Delete the report
            cursor.execute(DELETE_SYSTEM_REPORT, (report_id,))

            # Decrement report count for the administrator
            cursor.execute(DECREMENT_REPORT_COUNT, (administrator_id,))

            commit_db()
            return True
        except Exception as e:
            print(f"Error deleting report: {e}")
            raise
