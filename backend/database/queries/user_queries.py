# Base user queries
CREATE_USER = """
INSERT INTO user (name, gender, email, password, birth_date, blood_type, phone_number)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

GET_USER_BY_ID = """
SELECT * FROM user WHERE user_id = %s
"""

GET_USER_BY_EMAIL = """
SELECT * FROM user WHERE email = %s
"""

# Role-specific queries
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