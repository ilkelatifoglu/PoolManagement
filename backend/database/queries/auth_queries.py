LOGIN_USER = """
SELECT 
    user_id,
    name,
    email,
    password,
    'swimmer' as user_type  # For now, all users are swimmers
FROM user
WHERE email = %s
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