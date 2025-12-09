-- TABLA: notifications
-- Descripción: Notificaciones del sistema para los usuarios.

DROP TABLE IF EXISTS notifications;

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    message         TEXT NOT NULL,
    link            VARCHAR(255),
    is_read         BOOLEAN NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_notifications_user (user_id),

    -- Relaciones al final
    CONSTRAINT fk_notifications_user 
        FOREIGN KEY (user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;