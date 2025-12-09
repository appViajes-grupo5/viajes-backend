-- TABLA: users
-- Descripción: Almacena la información de perfil y credenciales de los usuarios.

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id             INT AUTO_INCREMENT PRIMARY KEY,
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    phone               VARCHAR(25),
    bio                 TEXT,
    interests           TEXT,
    profile_picture_url VARCHAR(255),
    average_rating      DECIMAL(3, 2) DEFAULT 0.00,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices para optimizar búsquedas frecuentes
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;