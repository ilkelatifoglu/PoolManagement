CREATE_BUSY_SESSIONS_VIEW = """
CREATE VIEW busy_sessions AS
SELECT 
    cl.coach_id,
    b.session_id
FROM class cl
JOIN booking b ON b.booking_id = cl.class_id
UNION
SELECT 
    t.coach_id,
    b.session_id
FROM training t
JOIN booking b ON t.training_id = b.booking_id
WHERE t.is_paid = 0;
"""

GET_AVAILABLE_COACHES = """
SELECT 
    c.coach_id,
    u.name AS coach_name,
    c.specialization,
    s.session_id,
    c.pool_id,
    s.date,
    s.start_time,
    s.end_time
FROM coach c
JOIN user u ON c.coach_id = u.user_id
JOIN session s
LEFT JOIN busy_sessions bcs 
    ON bcs.coach_id = c.coach_id AND bcs.session_id = s.session_id
WHERE bcs.session_id IS NULL
ORDER BY s.date, s.start_time, u.name;
"""


GET_SELF_TRAININGS = """
SELECT 
    st.self_training_id,
    st.goal,
    st.is_paid,
    st.swimmer_id,
    s.date,
    s.start_time,
    s.end_time,
    p.name AS pool_name
FROM self_training st
JOIN booking b ON st.self_training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
JOIN pool p ON b.pool_id = p.pool_id
WHERE st.swimmer_id = %s AND st.is_paid = 0
LIMIT 0, 1000;
"""

ADD_TRAINING = """
INSERT INTO training (training_id, swimmer_id, coach_id, goal, is_paid) 
VALUES (%s, %s, %s, %s, 0);
"""

ADD_SELF_TRAINING = """
INSERT INTO self_training (self_training_id, swimmer_id, goal, is_paid)
VALUES (%s, %s, %s, 0);
"""

DELETE_TRAINING = """
DELETE FROM training
WHERE training_id = %s AND swimmer_id = %s;
"""

DELETE_SELF_TRAINING = """
DELETE FROM self_training
WHERE self_training_id = %s AND swimmer_id = %s;
"""


# Fetch all available trainings for swimmers
GET_TRAININGS_FOR_SWIMMERS = """
SELECT 
    t.training_id,
    t.goal,
    s.date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    u.name AS coach_name
FROM training t
JOIN booking b ON t.training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
JOIN pool p ON b.pool_id = p.pool_id
JOIN user u ON t.coach_id = u.user_id
WHERE t.swimmer_id IS NULL;
"""

# Fetch all trainings assigned to a specific coach
GET_TRAININGS_FOR_COACH = """
SELECT 
    t.training_id,
    t.goal,
    t.is_paid,
    s.date,
    s.start_time,
    s.end_time,
    p.name AS pool_name,
    u.name AS swimmer_name
FROM training t
JOIN booking b ON t.training_id = b.booking_id
JOIN session s ON b.session_id = s.session_id
JOIN pool p ON b.pool_id = p.pool_id
JOIN user u ON t.swimmer_id = u.user_id
WHERE t.coach_id = %s;
"""
