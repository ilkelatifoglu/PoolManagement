GET_ALL_LIFEGUARD_SCHEDULES = """
SELECT 
    us.user_id,
    u.name,
    us.day_of_week,
    us.time_slot,
    us.is_available
FROM user_schedule us
JOIN user u ON u.user_id = us.user_id
JOIN lifeguard l ON u.user_id = l.lifeguard_id
ORDER BY us.user_id, us.day_of_week, us.time_slot
"""

GET_ALL_LIFEGUARDS = """
SELECT 
    u.user_id,
    u.name,
    l.employment_date,
    l.certification_level,
    l.certification_expiry
FROM user u
JOIN lifeguard l ON u.user_id = l.lifeguard_id
""" 