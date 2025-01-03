GET_POOLS_BY_MANAGER = """
SELECT 
    p.*, 
    COUNT(l.lane_number) AS number_of_lanes
FROM 
    pool p
LEFT JOIN 
    lane l
ON 
    p.pool_id = l.pool_id
WHERE 
    p.manager_id = %s
GROUP BY 
    p.pool_id;
"""

CREATE_MEMBERSHIP = """INSERT INTO membership (pool_id, price, duration)
VALUES (%s, %s, %s);
"""
# Query to create a new pool
CREATE_POOL = """
INSERT INTO pool (manager_id, name, capacity, general_price, training_price)
VALUES (%s, %s, %s, %s, %s);
"""

# Query to delete a pool
DELETE_POOL = """
DELETE FROM pool
WHERE pool_id = %s;
"""

# Query to check if a pool exists (optional for delete validation)
CHECK_POOL_EXISTS = """
SELECT 1 FROM pool
WHERE pool_id = %s;
"""
UPDATE_POOL_PRICE = "UPDATE pool SET {attribute} = %s WHERE pool_id = %s"

GET_MEMBERSHIPS = """
            SELECT 
                m.membership_id,
                p.name AS pool_name,
                m.duration,
                m.price
            FROM membership m
            INNER JOIN pool p ON m.pool_id = p.pool_id
            WHERE p.manager_id = %s
            """

CHECK_MEMBERSHIP = "SELECT * FROM membership WHERE membership_id = %s"

DELETE_MEMBERSHIP = "DELETE FROM membership WHERE membership_id = %s"

GET_STAFFS = """
            SELECT 
                u.user_id, 
                u.name, 
                u.email,
                u.gender,
                u.birth_date,
                u.blood_type,
                'Lifeguard' AS role,
                lg.pool_id, 
                p.name AS pool_name
            FROM 
                user u
            JOIN 
                lifeguard lg ON lg.lifeguard_id = u.user_id
            JOIN 
                pool p ON p.pool_id = lg.pool_id
            WHERE 
                p.manager_id = %s

            UNION

            SELECT 
                u.user_id, 
                u.name, 
                u.email, 
                u.gender,
                u.birth_date,
                u.blood_type,
                'Coach' AS role,
                c.pool_id, 
                p.name AS pool_name
            FROM 
                user u
            JOIN 
                coach c ON c.coach_id = u.user_id
            JOIN 
                pool p ON p.pool_id = c.pool_id
            WHERE 
                p.manager_id = %s
            """

INSERT_LANES = """INSERT INTO lane (pool_id, lane_number)
VALUES (%s, %s);
"""