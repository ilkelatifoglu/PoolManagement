# Queries for fetching swimmer activities
GET_SWIMMER_ACTIVITIES = """
SELECT 
    c.name AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    CONCAT(coach_user.name, ' (', co.specialization, ')') AS instructor_name
FROM schedules sch
JOIN class c ON sch.class_id = c.class_id
JOIN session s ON c.booking_id = s.session_id
JOIN pool p ON s.pool_id = p.pool_id
JOIN coach ON c.coach_id = coach.coach_id
JOIN user coach_user ON coach.coach_id = coach_user.user_id
WHERE sch.swimmer_id = %s
ORDER BY s.date, s.start_time;
"""

# Queries for fetching coach activities
GET_COACH_ACTIVITIES = """
SELECT 
    c.name AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    COUNT(sch.swimmer_id) AS participant_count
FROM class c
JOIN session s ON c.booking_id = s.session_id
JOIN pool p ON s.pool_id = p.pool_id
LEFT JOIN schedules sch ON c.class_id = sch.class_id
WHERE c.coach_id = %s
GROUP BY c.name, s.date, s.start_time, s.end_time, p.name
ORDER BY s.date, s.start_time;
"""
