GET_TOTAL_SWIMMER_COUNT = "SELECT COUNT(*) AS total_swimmer_count FROM swimmer;"
GET_TOTAL_MEMBER_COUNT = "SELECT COUNT(*) AS total_member_count FROM has;"
GET_DAILY_SELF_TRAINING_COUNT = """
SELECT COUNT(*) AS daily_self_training_count
FROM self_training st
JOIN booking b ON st.self_training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
WHERE s.date = %s;
"""
GET_DAILY_TRAINING_COUNT = """
SELECT COUNT(*) AS daily_training_count
FROM training t
JOIN booking b ON t.training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
WHERE s.date = %s;
"""
GET_DAILY_CLASS_COUNT = """
SELECT COUNT(*) AS daily_class_count
FROM class c
JOIN booking b ON c.class_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
WHERE s.date = %s;
"""
GET_DAILY_PEAK_HOURS = """
SELECT 
    s.start_time, 
    s.end_time,
    COUNT(b.booking_id) AS booking_count
FROM booking b
JOIN session s ON b.session_id = s.session_id
WHERE s.date = %s
GROUP BY s.start_time, s.end_time
ORDER BY booking_count DESC
LIMIT 1;
"""
GET_AVERAGE_CANCELLATION_RATE = """
SELECT 
    COALESCE(
        (CAST(COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) AS FLOAT) /
        NULLIF(COUNT(*), 0)) * 100,
        0
    ) AS avg_cancellation_rate
FROM booking;
"""
GET_AVG_EVENT_ATTENDANCE_RATE = """
SELECT 
    COALESCE(
        (CAST(COUNT(a.swimmer_id) AS FLOAT) /
        NULLIF(
            (SELECT SUM(capacity) FROM event),
            0
        )) * 100,
        0
    ) AS avg_event_attendance_rate
FROM event e
LEFT JOIN attends a ON e.event_id = a.event_id;
"""
GET_DAILY_REVENUE = """
SELECT 
    COALESCE(SUM(amount), 0) AS daily_revenue
FROM payment
WHERE date = %s
  AND (class_id IS NOT NULL OR training_id IS NOT NULL OR self_training_id IS NOT NULL OR membership_id IS NOT NULL);
"""
GENERATE_SYSTEM_REPORT = """INSERT INTO system_report (
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
    avg_event_attendance_rate
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
);
"""
GET_SYSTEM_REPORTS = """
SELECT *
FROM system_report
WHERE administrator_id = %s
ORDER BY date DESC;
"""
CHECK_SYSTEM_REPORT = """SELECT * FROM system_report WHERE report_id = %s"""
DELETE_SYSTEM_REPORT = """DELETE FROM system_report WHERE report_id = %s"""
INCREMENT_REPORT_COUNT = """UPDATE administrator SET report_count = report_count + 1 WHERE administrator_id = %s"""
DECREMENT_REPORT_COUNT = """UPDATE administrator SET report_count = GREATEST(report_count - 1, 0) WHERE administrator_id = %s"""