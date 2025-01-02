GET_AVAILABLE_LANES = """
SELECT l.lane_number, l.type
FROM lane l
LEFT JOIN booking b 
    ON l.pool_id = b.pool_id 
    AND l.lane_number = b.lane_number 
    AND b.session_id = %(session_id)s
WHERE l.pool_id = %(pool_id)s 
    AND b.lane_number IS NULL;
"""
