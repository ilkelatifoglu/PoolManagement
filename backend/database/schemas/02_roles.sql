CREATE TABLE IF NOT EXISTS manager (
    manager_id INT NOT NULL,
    employment_date DATE NOT NULL,
    experience_level INT DEFAULT NULL,
    PRIMARY KEY (manager_id),
    FOREIGN KEY (manager_id) REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS swimmer (
    swimmer_id INT NOT NULL,
    swim_level INT DEFAULT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (swimmer_id),
    FOREIGN KEY (swimmer_id) REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coach (
    coach_id INT NOT NULL,
    employment_date DATE NOT NULL,
    specialization VARCHAR(50) DEFAULT NULL,
    years_of_experience INT DEFAULT NULL,
    avg_rating DECIMAL(3, 2) DEFAULT NULL,
    PRIMARY KEY (coach_id),
    FOREIGN KEY (coach_id) REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lifeguard (
    lifeguard_id INT NOT NULL,
    employment_date DATE NOT NULL,
    certification_level VARCHAR(50) DEFAULT NULL,
    certification_expiry DATE DEFAULT NULL,
    PRIMARY KEY (lifeguard_id),
    FOREIGN KEY (lifeguard_id) REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS administrator (
    administrator_id INT NOT NULL,
    report_count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (administrator_id),
    FOREIGN KEY (administrator_id) REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);