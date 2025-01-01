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
JOIN session s ON s.session_id = sch.class_id
JOIN lifeguard_session ls ON s.session_id = ls.session_id
JOIN pool p ON ls.pool_id = p.pool_id
JOIN coach co ON c.coach_id = co.coach_id
JOIN user coach_user ON co.coach_id = coach_user.user_id
WHERE sch.swimmer_id = %s
ORDER BY s.date, s.start_time
LIMIT 0, 1000;
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
JOIN booking b ON c.class_id = b.booking_id
JOIN session s ON b.booking_id = s.session_id
JOIN lifeguard_session ls ON s.session_id = ls.session_id
JOIN pool p ON ls.pool_id = p.pool_id
LEFT JOIN schedules sch ON c.class_id = sch.class_id
WHERE c.coach_id = %s
GROUP BY c.name, s.date, s.start_time, s.end_time, p.name
ORDER BY s.date, s.start_time;
"""

GET_TRAININGS_FOR_SWIMMER = """
SELECT 
    t.name AS training_name,
    t.training_id,
    t.level,
    t.course_content,
    c.name AS coach_name
FROM training t
JOIN coach c ON t.coach_id = c.coach_id
WHERE t.level <= %s; -- Swimmer's skill level
"""

GET_SELF_TRAININGS_FOR_SWIMMER = """
SELECT 
    st.self_training_id,
    st.date,
    st.start_time,
    st.end_time,
    p.name AS pool_name
FROM self_training st
JOIN pool p ON st.pool_id = p.pool_id
WHERE st.swimmer_id = %s;
"""

CREATE_SELF_TRAINING = """
INSERT INTO self_training (swimmer_id, pool_id, date, start_time, end_time)
VALUES (%s, %s, %s, %s, %s);
"""

CREATE_TRAINING = """
INSERT INTO training (coach_id, pool_id, date, start_time, end_time, name, level, course_content)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
"""

ADD_TO_CART = """
INSERT INTO cart (swimmer_id, activity_type, activity_id, quantity)
VALUES (%s, %s, %s, %s);
"""

GET_CART_ITEMS = """
SELECT 
    c.cart_id,
    c.activity_type,
    c.activity_id,
    c.quantity,
    CASE 
        WHEN c.activity_type = 'self_training' THEN st.name
        WHEN c.activity_type = 'training' THEN t.name
        ELSE 'Unknown'
    END AS activity_name
FROM cart c
LEFT JOIN self_training st ON c.activity_type = 'self_training' AND c.activity_id = st.self_training_id
LEFT JOIN training t ON c.activity_type = 'training' AND c.activity_id = t.training_id
WHERE c.swimmer_id = %s;
"""

REMOVE_FROM_CART = """
DELETE FROM cart WHERE cart_id = %s;
"""
