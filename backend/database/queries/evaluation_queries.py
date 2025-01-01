GET_EVAL_ITEMS = """
SELECT
    CASE
        WHEN training.training_id IS NOT NULL THEN 'Training'
        WHEN schedules.class_id IS NOT NULL THEN 'Class'
    END AS Reservation,
    u.name AS Coach,
    s.date AS Date,
    CONCAT(s.start_time, ' - ', s.end_time) AS Time,
    p.name AS Pool,
    CASE
        WHEN training.training_id IS NOT NULL THEN p.training_price
        WHEN schedules.class_id IS NOT NULL THEN c.price
    END AS Price,
    booking.booking_id
FROM
    booking
LEFT JOIN training ON booking.booking_id = training.training_id
LEFT JOIN schedules ON booking.booking_id = schedules.class_id
LEFT JOIN session s ON booking.session_id = s.session_id
LEFT JOIN pool p ON booking.pool_id = p.pool_id
LEFT JOIN class c ON schedules.class_id = c.class_id
LEFT JOIN user u ON (training.coach_id = u.user_id OR c.coach_id = u.user_id)
WHERE
    (
        (training.swimmer_id = %(swimmer_id)s AND training.is_paid = 1) OR
        (schedules.swimmer_id = %(swimmer_id)s AND schedules.is_paid = 1)
    )
    AND booking.status = 'DONE';
"""