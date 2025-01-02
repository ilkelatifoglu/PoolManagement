GET_ALL_SESSIONS = """
SELECT 
    session_id,
    date,
    start_time,
    end_time
FROM session;
"""

GET_AVAILABLE_SESSIONS = """
SELECT DISTINCT s.session_id, s.date, s.start_time, s.end_time
FROM session s
JOIN lane l ON l.pool_id = %s  -- Use pool_id passed as a parameter
LEFT JOIN booking b ON b.session_id = s.session_id AND b.lane_number = l.lane_number
WHERE b.booking_id IS NULL
ORDER BY s.date, s.start_time;
"""

