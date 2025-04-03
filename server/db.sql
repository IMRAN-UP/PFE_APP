-- Active: 1743695263796@@127.0.0.1@5432@SMART_WARDROBE@public

-- Create database if it doesn't exist
CREATE DATABASE "SMART_WARDROBE" WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' TEMPLATE template0;

-- Connect to the database
\c "SMART_WARDROBE";

-- Create user and grant privileges
CREATE USER "web_user" WITH PASSWORD '0707';
GRANT ALL PRIVILEGES ON DATABASE "SMART_WARDROBE" TO "web_user";
GRANT ALL PRIVILEGES ON SCHEMA public TO "web_user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "web_user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "web_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "web_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "web_user";
GRANT USAGE, CREATE ON SCHEMA public TO "web_user";

-- Drop the table if it exists
DROP TABLE IF EXISTS users;

-- Create the users table with all fields from the User model
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    birthday DATE NOT NULL,
    phone_number VARCHAR(20),
    photo_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Insert a sample user (password is hashed in the application)
INSERT INTO users (
    username, first_name, last_name, email, password, 
    is_superuser, is_staff, is_active, date_joined,
    gender, birthday, phone_number
)
VALUES (
    'admin', 'Admin', 'User', 'admin@example.com', 'hashed_password_here',
    TRUE, TRUE, TRUE, CURRENT_TIMESTAMP,
    'M', '1990-01-01', '+1234567890'
);

-- Grant specific permissions to web_user for the users table
GRANT ALL PRIVILEGES ON TABLE users TO "web_user";
GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO "web_user";

-- Make sure web_user has all necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO "web_user";
GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO "web_user";

-- Query to view all users
SELECT * FROM users;