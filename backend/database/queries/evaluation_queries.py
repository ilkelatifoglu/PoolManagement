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
    booking.booking_id,
    CASE
        WHEN training.training_id IS NOT NULL THEN training.coach_id
        WHEN schedules.class_id IS NOT NULL THEN c.coach_id
    END AS CoachID,
    schedules.class_id AS ClassID,
    schedules.is_evaluated_coach AS is_evaluated_coach,
    schedules.is_evaluated_class AS is_evaluated_class,
    training.is_evaluated AS is_evaluated
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
        (training.swimmer_id = %(swimmer_id)s AND training.is_paid = 1 AND training.is_evaluated = 0) OR
        (schedules.swimmer_id = %(swimmer_id)s AND schedules.is_paid = 1 AND 
         (schedules.is_evaluated_coach = 0 OR schedules.is_evaluated_class = 0))
    )
    AND booking.status = 'DONE';
"""

INSERT_EVALUATION = """
INSERT INTO evaluation (swimmer_id, coach_id, class_id, rating, comment)
VALUES (%(swimmer_id)s, %(coach_id)s, %(class_id)s, %(rating)s, %(comment)s)
"""
