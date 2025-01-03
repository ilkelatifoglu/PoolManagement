# Queries for fetching swimmer activities
GET_SWIMMER_ACTIVITIES = """
SELECT
    c.class_id AS activity_id,
    'class' AS activity_type,
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
WHERE sch.swimmer_id = %s AND sch.is_paid = 1

UNION ALL

SELECT 
    st.self_training_id AS activity_id,
    'self_training' AS activity_type,
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
WHERE st.swimmer_id = %s AND st.is_paid = 1

UNION ALL

SELECT 
    t.training_id AS activity_id,
    'training' AS activity_type,
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
WHERE t.swimmer_id = %s AND t.is_paid = 1

UNION ALL

SELECT
    e.event_id AS activity_id,
    'event' AS activity_type,
    e.status,
    e.event_name AS activity_name,
    s.date AS activity_date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    mu.name AS instructor_name
FROM event e
JOIN event_session es ON es.event_id = e.event_id
JOIN session s ON es.session_id = s.session_id
JOIN pool p ON p.pool_id = es.pool_id
JOIN attends a ON a.event_id = e.event_id
JOIN user u ON u.user_id = a.swimmer_id
JOIN user mu ON mu.user_id = e.manager_id
WHERE a.swimmer_id = %s

ORDER BY 
    CASE 
        WHEN status = 'READY' THEN 1
        WHEN status = 'CANCELLED' THEN 2
        WHEN status = 'DONE' THEN 3
        ELSE 4
    END,
    activity_date, 
    start_time
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


