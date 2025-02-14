GET_CART_ITEMS = """
SELECT
    CASE
        WHEN training.training_id IS NOT NULL THEN 'Training'
        WHEN self_training.self_training_id IS NOT NULL THEN 'Personal Use'
        WHEN schedules.class_id IS NOT NULL THEN 'Class'
    END AS Reservation,
    COALESCE(u.name, '') AS Coach,
    s.date AS Date,
    CONCAT(s.start_time, ' - ', s.end_time) AS Time,
    p.name AS Pool,
    CASE
        WHEN training.training_id IS NOT NULL THEN p.training_price
        WHEN self_training.self_training_id IS NOT NULL THEN p.general_price
        WHEN schedules.class_id IS NOT NULL THEN c.price
    END AS Price,
    booking.booking_id
FROM
    booking
LEFT JOIN training ON booking.booking_id = training.training_id
LEFT JOIN self_training ON booking.booking_id = self_training.self_training_id
LEFT JOIN schedules ON booking.booking_id = schedules.class_id
LEFT JOIN session s ON booking.session_id = s.session_id
LEFT JOIN pool p ON booking.pool_id = p.pool_id
LEFT JOIN class c ON schedules.class_id = c.class_id
LEFT JOIN user u ON (training.coach_id = u.user_id OR c.coach_id = u.user_id)
WHERE
    (
        (training.swimmer_id = %(swimmer_id)s AND training.is_paid = 0) OR
        (self_training.swimmer_id = %(swimmer_id)s AND self_training.is_paid = 0) OR
        (schedules.swimmer_id = %(swimmer_id)s AND schedules.is_paid = 0)
    )
    AND booking.status = 'READY';
"""


DELETE_CART_ITEM = """
DELETE FROM booking
WHERE booking_id = %s;
"""

DELETE_FROM_SCHEDULES = """
DELETE FROM schedules
WHERE class_id = %s AND swimmer_id = %s;
"""

GET_BALANCE = """
SELECT balance
FROM swimmer
WHERE swimmer_id = %(swimmer_id)s;
"""

UPDATE_TRAINING_IS_PAID = """
UPDATE training
SET is_paid = 1
WHERE training_id = %(booking_id)s;
"""

UPDATE_SELF_TRAINING_IS_PAID = """
UPDATE self_training
SET is_paid = 1
WHERE self_training_id = %(booking_id)s;
"""

UPDATE_SCHEDULES_IS_PAID = """
UPDATE schedules
SET is_paid = 1
WHERE class_id = %(booking_id)s AND swimmer_id = %(swimmer_id)s;
"""
UPDATE_BALANCE_ON_PURCHASE = """
UPDATE swimmer
SET balance = balance - %(amount)s
WHERE swimmer_id = %(swimmer_id)s;
"""
INSERT_PAYMENT_BOOKING = """
INSERT INTO payment (swimmer_id, amount, date, class_id, training_id, self_training_id)
VALUES (%(swimmer_id)s, %(amount)s, %(date)s, %(class_id)s, %(training_id)s, %(self_training_id)s);
"""

INSERT_PAYMENT_BALANCE = """
INSERT INTO payment (swimmer_id, amount, date, class_id, training_id, self_training_id)
VALUES (%(swimmer_id)s, %(amount)s, %(date)s, NULL, NULL, NULL);
"""

INSERT_PAYMENT_MEMBERSHIP = """
INSERT INTO payment (swimmer_id, amount, date, membership_id)
VALUES (%(swimmer_id)s, %(amount)s, CURRENT_DATE, %(membership_id)s);
"""

UPDATE_BALANCE = """
UPDATE swimmer
SET balance = balance + %(amount)s
WHERE swimmer_id = %(swimmer_id)s;
"""

GET_AVAILABLE_MEMBERSHIPS = """
SELECT
    p.name AS PoolName,
    m.duration AS MembershipDuration,
    m.price AS MembershipPrice,
    m.membership_id
FROM
    membership m
INNER JOIN
    pool p ON m.pool_id = p.pool_id
WHERE
    p.pool_id NOT IN (
        SELECT DISTINCT m.pool_id
        FROM membership m
        INNER JOIN has h ON m.membership_id = h.membership_id
        WHERE h.swimmer_id = %(swimmer_id)s
    );
"""

GET_MEMBERSHIP_PRICE = """
SELECT price
FROM membership
WHERE membership_id = %(membership_id)s;
"""

INSERT_MEMBERSHIP = """
INSERT INTO has (swimmer_id, membership_id, end_date)
VALUES (%(swimmer_id)s, %(membership_id)s, CURRENT_DATE + INTERVAL %(duration)s MONTH);
"""
