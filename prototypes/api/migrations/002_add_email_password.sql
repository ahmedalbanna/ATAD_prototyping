-- Add email and password fields to users table
ALTER TABLE users ADD COLUMN email TEXT;
ALTER TABLE users ADD COLUMN password TEXT;
