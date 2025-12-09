-- TABLA: trip_participants
-- Descripción: Gestiona la relación de usuarios unidos a los viajes (solicitudes).

DROP TABLE IF EXISTS trip_participants;

CREATE TABLE trip_participants (
    participant_id  INT AUTO_INCREMENT PRIMARY KEY,
    trip_id         INT NOT NULL,
    user_id         INT NOT NULL,
    status          ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    requested_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_participants_user (user_id),

    -- Restricciones de unicidad al final
    UNIQUE KEY uk_trip_participant (trip_id, user_id),

    -- Relaciones al final
    CONSTRAINT fk_participants_trip 
        FOREIGN KEY (trip_id) REFERENCES trips (trip_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_participants_user 
        FOREIGN KEY (user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;