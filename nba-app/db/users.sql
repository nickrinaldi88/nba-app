CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    fName VARCHAR(255),
    lName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    zip VARCHAR(10),
    password_hash VARCHAR(255) -- 'password' column is renamed to 'password_hash' to clarify storage format
);
