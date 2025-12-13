USE travel_app_db;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'trips' 
    AND INDEX_NAME = 'idx_trips_creator'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_trips_creator ON trips(creator_id)', 'SELECT "Índice idx_trips_creator ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'trip_participants' 
    AND INDEX_NAME = 'idx_participants_trip'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_participants_trip ON trip_participants(trip_id)', 'SELECT "Índice idx_participants_trip ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'trip_participants' 
    AND INDEX_NAME = 'idx_participants_user'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_participants_user ON trip_participants(user_id)', 'SELECT "Índice idx_participants_user ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'ratings' 
    AND INDEX_NAME = 'idx_ratings_trip'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_ratings_trip ON ratings(trip_id)', 'SELECT "Índice idx_ratings_trip ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'ratings' 
    AND INDEX_NAME = 'idx_ratings_rated'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_ratings_rated ON ratings(rated_user_id)', 'SELECT "Índice idx_ratings_rated ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'ratings' 
    AND INDEX_NAME = 'idx_ratings_rater'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_ratings_rater ON ratings(rater_user_id)', 'SELECT "Índice idx_ratings_rater ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'trip_comments' 
    AND INDEX_NAME = 'idx_comments_trip'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_comments_trip ON trip_comments(trip_id)', 'SELECT "Índice idx_comments_trip ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'trip_comments' 
    AND INDEX_NAME = 'idx_comments_user'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_comments_user ON trip_comments(user_id)', 'SELECT "Índice idx_comments_user ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'notifications' 
    AND INDEX_NAME = 'idx_notifications_user'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_notifications_user ON notifications(user_id)', 'SELECT "Índice idx_notifications_user ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'travel_app_db' 
    AND TABLE_NAME = 'notifications' 
    AND INDEX_NAME = 'idx_notifications_read'
);
SET @sql = IF(@index_exists = 0, 'CREATE INDEX idx_notifications_read ON notifications(is_read)', 'SELECT "Índice idx_notifications_read ya existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Verificación de índices completada' AS status;
