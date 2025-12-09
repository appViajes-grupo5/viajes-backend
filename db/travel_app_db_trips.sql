-- TABLA: trips
-- Descripción: Almacena la información detallada de los viajes creados.

DROP TABLE IF EXISTS trips;

CREATE TABLE trips (
    trip_id                 INT AUTO_INCREMENT PRIMARY KEY,
    creator_id              INT NOT NULL,
    title                   VARCHAR(255) NOT NULL,
    description             TEXT NOT NULL,
    destination             VARCHAR(255) NOT NULL,
    start_date              DATE NOT NULL,
    end_date                DATE NOT NULL,
    estimated_cost          DECIMAL(10, 2),
    min_participants        INT DEFAULT 1,
    transport_details       TEXT,
    accommodation_details   TEXT,
    itinerary               TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_trips_creator (creator_id),

    -- Relaciones (Foreign Keys) al final
    CONSTRAINT fk_trips_creator 
        FOREIGN KEY (creator_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;