LOGIN_USER = """
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.password,
    CASE 
        WHEN s.swimmer_id IS NOT NULL THEN 'swimmer'
        WHEN c.coach_id IS NOT NULL THEN 'coach'
        WHEN l.lifeguard_id IS NOT NULL THEN 'lifeguard'
        WHEN m.manager_id IS NOT NULL THEN 'manager'
        WHEN a.administrator_id IS NOT NULL THEN 'administrator'
        ELSE 'unknown'
    END AS user_type
FROM user u
LEFT JOIN swimmer s ON u.user_id = s.swimmer_id
LEFT JOIN coach c ON u.user_id = c.coach_id
LEFT JOIN lifeguard l ON u.user_id = l.lifeguard_id
LEFT JOIN manager m ON u.user_id = m.manager_id
LEFT JOIN administrator a ON u.user_id = a.administrator_id
WHERE u.email = %s
"""

REGISTER_USER = """
INSERT INTO `user` (name, gender, email, password, birth_date, blood_type)
VALUES (%s, %s, %s, %s, %s, %s)
"""

REGISTER_PHONE = """
INSERT INTO user_phone (user_id, phone_number)
VALUES (LAST_INSERT_ID(), %s)
"""

REGISTER_SWIMMER = """
INSERT INTO swimmer (swimmer_id, swim_level)
VALUES (LAST_INSERT_ID(), %s)
"""