-- TABLA: ratings
-- Descripción: Almacena las valoraciones y comentarios entre usuarios.

DROP TABLE IF EXISTS ratings;

CREATE TABLE ratings (
    rating_id       INT AUTO_INCREMENT PRIMARY KEY,
    trip_id         INT NOT NULL,
    rater_user_id   INT NOT NULL,
    rated_user_id   INT NOT NULL,
    rating_value    INT NOT NULL,
    comment         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_ratings_rater (rater_user_id),
    INDEX idx_ratings_rated (rated_user_id),

    -- Restricciones de unicidad y CHECK al final
    UNIQUE KEY uk_rating_trip_users (trip_id, rater_user_id, rated_user_id),
    CONSTRAINT chk_rating_value CHECK (rating_value BETWEEN 1 AND 5),

    -- Relaciones al final
    CONSTRAINT fk_ratings_trip 
        FOREIGN KEY (trip_id) REFERENCES trips (trip_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_ratings_rater 
        FOREIGN KEY (rater_user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_ratings_rated 
        FOREIGN KEY (rated_user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;