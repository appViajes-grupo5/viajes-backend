-- Creación de la base de datos (Schema) si no existe
CREATE DATABASE IF NOT EXISTS travel_app_db
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE travel_app_db;

-- Tabla de Usuarios (Users)
-- Almacena la información de registro y perfil de cada usuario.
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Guardar siempre el hash, NUNCA la contraseña en texto plano
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(25),
    bio TEXT,
    interests TEXT, -- Puede ser un JSON o texto separado por comas
    profile_picture_url VARCHAR(255), -- URL de la imagen (ej. S3, Cloudinary)
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Viajes (Trips)
-- Almacena la información de cada viaje creado.
CREATE TABLE IF NOT EXISTS trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL, -- El ID del usuario que creó el viaje
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    estimated_cost DECIMAL(10, 2),
    min_participants INT DEFAULT 1,
    transport_details TEXT, -- como TEXT para más detalle
    accommodation_details TEXT, -- como TEXT para más detalle
    itinerary TEXT, -- (Requisito original: itinerario)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creator_id) REFERENCES users(user_id) 
        ON DELETE CASCADE -- Si se borra el usuario, se borran sus viajes creados
) ENGINE=InnoDB;

-- Tabla de Participantes del Viaje (Trip Participants)
-- Conecta a los usuarios con los viajes (relación N-a-N).
CREATE TABLE IF NOT EXISTS trip_participants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', -- (Mejora: ENUM es más robusto que VARCHAR)
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_trip_user (trip_id, user_id), -- Un usuario solo puede inscribirse una vez por viaje
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Valoraciones (Ratings)
-- Almacena las valoraciones que los usuarios se dan entre sí después de un viaje.
CREATE TABLE IF NOT EXISTS ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    rater_user_id INT NOT NULL, -- El usuario que da la valoración
    rated_user_id INT NOT NULL, -- El usuario que recibe la valoración
    rating_value INT NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_rating (trip_id, rater_user_id, rated_user_id), -- Solo se puede valorar una vez por persona y viaje
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (rater_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (rated_user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Comentarios del Viaje (Trip Comments)
-- Para la funcionalidad deseable del foro interno del viaje.
CREATE TABLE IF NOT EXISTS trip_comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Notificaciones (Notifications)
-- Almacena notificaciones para los usuarios (ej. "Tu solicitud fue aprobada").
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- El usuario que RECIBE la notificación
    message TEXT NOT NULL,
    link VARCHAR(255), -- Enlace opcional (ej. /trips/123)
    is_read BOOLEAN NOT NULL DEFAULT 0, -- 0 = no leída, 1 = leída
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;