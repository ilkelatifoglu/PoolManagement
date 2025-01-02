ADD_BOOKING = """
INSERT INTO booking (session_id, pool_id, lane_number, status)
VALUES (%s, %s, %s, %s);
"""
