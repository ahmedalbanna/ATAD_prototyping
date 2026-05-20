-- Add verification status to users table
ALTER TABLE users ADD COLUMN verified TEXT NOT NULL DEFAULT 'none' CHECK (verified IN ('none', 'pending', 'verified'));
