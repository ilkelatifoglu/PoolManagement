CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT NOT NULL, 
    name VARCHAR(100) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    blood_type CHAR(3) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS user_phone (
    user_id INT NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    PRIMARY KEY (user_id, phone_number),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);