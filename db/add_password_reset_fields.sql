ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expires DATETIME NULL;

CREATE INDEX idx_users_reset_token ON users(reset_token);

