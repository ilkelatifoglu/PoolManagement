# Queries for fetching swimmer activities
GET_SWIMMER_ACTIVITIES = """
SELECT
    c.class_id AS activity_id,
    b.status,
    c.name AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    CONCAT(coach_user.name, ' (', co.specialization, ')') AS instructor_name
FROM schedules sch
JOIN class c ON sch.class_id = c.class_id
JOIN booking b ON b.booking_id = c.class_id
JOIN session s ON s.session_id = b.session_id
JOIN coach co ON c.coach_id = co.coach_id
JOIN pool p ON co.pool_id = p.pool_id
JOIN user coach_user ON co.coach_id = coach_user.user_id
WHERE sch.swimmer_id = %s

UNION ALL

SELECT 
    st.self_training_id AS activity_id,
    b.status,
    'Self-Training' AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    NULL AS instructor_name
FROM self_training st
JOIN booking b ON st.self_training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
JOIN pool p ON b.pool_id = p.pool_id
WHERE st.swimmer_id = %s

UNION ALL

SELECT 
    t.training_id AS activity_id,
    b.status,
    'Training' AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    CONCAT(coach_user.name, ' (', co.specialization, ')') AS instructor_name
FROM training t
JOIN booking b ON t.training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
JOIN coach co ON t.coach_id = co.coach_id
JOIN pool p ON b.pool_id = p.pool_id
JOIN user coach_user ON co.coach_id = coach_user.user_id
WHERE t.swimmer_id = %s

ORDER BY activity_date, start_time
LIMIT 0, 1000;
"""


# Queries for fetching coach activities
GET_COACH_ACTIVITIES = """
SELECT 
    c.class_id AS activity_id,
    b.status,
    c.name AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    COUNT(sch.swimmer_id) AS participant_count
FROM class c
JOIN coach co ON co.coach_id = c.coach_id
JOIN booking b ON c.class_id = b.booking_id
JOIN session s ON s.session_id = b.session_id
JOIN pool p ON co.pool_id = p.pool_id
LEFT JOIN schedules sch ON c.class_id = sch.class_id
WHERE c.coach_id = %s
GROUP BY c.class_id, b.status, c.name, s.date, s.start_time, s.end_time, p.name

UNION

SELECT
    t.training_id AS activity_id,
    b.status,
    'Training' AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    u.name AS participant_count
FROM training t
JOIN coach co ON co.coach_id = t.coach_id
JOIN booking b ON t.training_id = b.booking_id
JOIN session s ON s.session_id = b.session_id
JOIN pool p ON co.pool_id = p.pool_id
JOIN user u ON u.user_id = t.swimmer_id
WHERE t.coach_id = %s
GROUP BY t.training_id, b.status, s.date, s.start_time, s.end_time, p.name

ORDER BY activity_date, start_time;
"""


