# Database Setup and Troubleshooting

This README provides instructions for setting up and troubleshooting the database for the Smart Wardrobe application.

## Database Setup

### Option 1: Using the provided scripts

1. First, make sure you have the required dependencies:
   ```
   pip install psycopg2-binary
   ```

2. Edit the database connection settings in the scripts:
   - Open `recreate_db.py` and update the PostgreSQL password
   - Open `fix_db.py` and update the PostgreSQL password

3. Run the scripts in sequence:
   ```
   python recreate_db.py
   python setup_db.py
   ```

### Option 2: Manual setup

1. Connect to PostgreSQL as the superuser:
   ```
   psql -U postgres
   ```

2. Run the SQL commands in `db.sql`:
   ```
   \i path/to/db.sql
   ```

3. Run the Django migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

## Troubleshooting

### Permission Issues

If you encounter "permission denied" errors:

1. Run the `fix_permissions.py` script:
   ```
   python fix_permissions.py
   ```

2. Or run the SQL commands in `fix_permissions.sql` directly:
   ```
   psql -U postgres -d SMART_WARDROBE -f fix_permissions.sql
   ```

### Missing Columns

If you encounter errors about missing columns (like "column 'last_login' does not exist"):

1. The database schema needs to be updated to match the Django model
2. Run the `recreate_db.py` script to recreate the database with the correct schema
3. Then run the `setup_db.py` script to apply migrations

## Database Schema

The database schema includes the following tables:

- `users`: Stores user information including authentication details

## User Model

The User model extends Django's AbstractBaseUser and includes the following fields:

- `username`: Unique identifier for the user
- `first_name`: User's first name
- `last_name`: User's last name
- `email`: User's email address (used for login)
- `password`: Hashed password
- `gender`: User's gender (M/F)
- `birthday`: User's date of birth
- `phone_number`: User's phone number
- `photo_path`: Path to user's profile photo
- `is_active`: Whether the user account is active
- `is_staff`: Whether the user has staff permissions
- `is_superuser`: Whether the user has superuser permissions
- `date_joined`: When the user joined
- `last_login`: When the user last logged in 