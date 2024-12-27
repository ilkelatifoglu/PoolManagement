# Base user queries
CREATE_USER = """
INSERT INTO user (name, gender, email, password, birth_date, blood_type, phone_number)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

GET_USER_BY_ID = """
SELECT 
    u.*,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'swimmer'
        WHEN c.user_id IS NOT NULL THEN 'coach'
        WHEN l.user_id IS NOT NULL THEN 'lifeguard'
        WHEN m.user_id IS NOT NULL THEN 'manager'
        WHEN a.user_id IS NOT NULL THEN 'administrator'
        ELSE 'user'
    END as role
FROM user u
LEFT JOIN swimmer s ON u.user_id = s.user_id
LEFT JOIN coach c ON u.user_id = c.user_id
LEFT JOIN lifeguard l ON u.user_id = l.user_id
LEFT JOIN manager m ON u.user_id = m.user_id
LEFT JOIN administrator a ON u.user_id = a.user_id
WHERE u.user_id = %s
"""

GET_USER_BY_EMAIL = """
SELECT 
    u.*,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'swimmer'
        WHEN c.user_id IS NOT NULL THEN 'coach'
        WHEN l.user_id IS NOT NULL THEN 'lifeguard'
        WHEN m.user_id IS NOT NULL THEN 'manager'
        WHEN a.user_id IS NOT NULL THEN 'administrator'
        ELSE 'user'
    END as role
FROM user u
LEFT JOIN swimmer s ON u.user_id = s.user_id
LEFT JOIN coach c ON u.user_id = c.user_id
LEFT JOIN lifeguard l ON u.user_id = l.user_id
LEFT JOIN manager m ON u.user_id = m.user_id
LEFT JOIN administrator a ON u.user_id = a.user_id
WHERE u.email = %s
"""

UPDATE_USER = """
UPDATE user 
SET 
    name = %s,
    gender = %s,
    blood_type = %s,
    phone_number = %s
WHERE user_id = %s
"""

# Role-specific queries - CREATE
CREATE_MANAGER = """
INSERT INTO manager (user_id, employment_date, experience_level)
VALUES (%s, %s, %s)
"""

CREATE_SWIMMER = """
INSERT INTO swimmer (user_id, swim_level, balance)
VALUES (%s, %s, %s)
"""

CREATE_COACH = """
INSERT INTO coach (user_id, employment_date, specialization, years_of_experience)
VALUES (%s, %s, %s, %s)
"""

CREATE_LIFEGUARD = """
INSERT INTO lifeguard (user_id, employment_date, certification_expiry)
VALUES (%s, %s, %s)
"""

CREATE_ADMINISTRATOR = """
INSERT INTO administrator (user_id, report_count)
VALUES (%s, %s)
"""

# Role-specific queries - GET
GET_MANAGER = """
SELECT * FROM manager WHERE user_id = %s
"""

GET_SWIMMER = """
SELECT * FROM swimmer WHERE user_id = %s
"""

GET_COACH = """
SELECT * FROM coach WHERE user_id = %s
"""

GET_LIFEGUARD = """
SELECT * FROM lifeguard WHERE user_id = %s
"""

GET_ADMINISTRATOR = """
SELECT * FROM administrator WHERE user_id = %s
"""

# Role-specific queries - UPDATE
UPDATE_SWIMMER = """
UPDATE swimmer
SET 
    swim_level = %s,
    balance = %s
WHERE user_id = %s
"""

UPDATE_COACH = """
UPDATE coach
SET 
    specialization = %s,
    years_of_experience = %s
WHERE user_id = %s
"""

UPDATE_LIFEGUARD = """
UPDATE lifeguard
SET certification_expiry = %s
WHERE user_id = %s
"""

UPDATE_MANAGER = """
UPDATE manager
SET experience_level = %s
WHERE user_id = %s
"""

# Specific operations
UPDATE_SWIMMER_BALANCE = """
UPDATE swimmer
SET balance = balance + %s
WHERE user_id = %s
"""

GET_COACH_RATING = """
SELECT avg_rating FROM coach WHERE user_id = %s
"""

UPDATE_COACH_RATING = """
UPDATE coach
SET avg_rating = %s
WHERE user_id = %s
"""

GET_LIFEGUARD_CERTIFICATION = """
SELECT certification_expiry, certification_level 
FROM lifeguard 
WHERE user_id = %s
"""

GET_ADMINISTRATOR_REPORT_COUNT = """
SELECT report_count 
FROM administrator 
WHERE user_id = %s
"""