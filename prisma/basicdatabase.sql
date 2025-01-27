create database test; -- creates test database
USE test;

-- Create the Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique user ID
    email VARCHAR(100) UNIQUE NOT NULL,      -- User email
    password_hash TEXT NOT NULL,             -- Hashed password
    tags json,     						-- User tags in JSON format
    current_bids json;                   -- storing all the post id's with bids?
);


-- Create the Posts table
CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique post ID
    user_id INT NOT NULL,                    -- Foreign key to the Users table
    title VARCHAR(255) NOT NULL,             -- Title of the post
    item_description TEXT, -- Description of the post
    tags JSON, 
    inital_price DECIMAL(10, 2),   -- Price of the item or service
    current_price DECIMAL(
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);






