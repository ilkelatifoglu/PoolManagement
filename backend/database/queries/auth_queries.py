LOGIN_USER = """
SELECT 
    u.user_id,
    u.name,
    u.email,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'swimmer'
        WHEN c.user_id IS NOT NULL THEN 'coach'
        WHEN l.user_id IS NOT NULL THEN 'lifeguard'
        WHEN m.user_id IS NOT NULL THEN 'manager'
        WHEN a.user_id IS NOT NULL THEN 'administrator'
        ELSE 'user'
    END as user_type
FROM user u
LEFT JOIN swimmer s ON u.user_id = s.user_id
LEFT JOIN coach c ON u.user_id = c.user_id
LEFT JOIN lifeguard l ON u.user_id = l.user_id
LEFT JOIN manager m ON u.user_id = m.user_id
LEFT JOIN administrator a ON u.user_id = a.user_id
WHERE u.email = %s
"""

REGISTER_USER = """
INSERT INTO user (name, gender, email, password, birth_date, blood_type)
VALUES (%s, %s, %s, %s, %s, %s)
"""

REGISTER_PHONE = """
INSERT INTO user_phone (user_id, phone_number)
VALUES (%s, %s)
"""

REGISTER_SWIMMER = """
INSERT INTO swimmer (user_id, swim_level)
VALUES (%s, %s)
"""