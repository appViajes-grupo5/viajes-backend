-- TABLA: trip_comments
-- Descripción: Foro interno o chat de cada viaje.

DROP TABLE IF EXISTS trip_comments;

CREATE TABLE trip_comments (
    comment_id      INT AUTO_INCREMENT PRIMARY KEY,
    trip_id         INT NOT NULL,
    user_id         INT NOT NULL,
    comment_text    TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_trip_comments_trip (trip_id),
    INDEX idx_trip_comments_user (user_id),

    -- Relaciones al final
    CONSTRAINT fk_trip_comments_trip 
        FOREIGN KEY (trip_id) REFERENCES trips (trip_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_trip_comments_user 
        FOREIGN KEY (user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;