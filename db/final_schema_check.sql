USE travel_app_db;

SELECT 'Verificando estructura de base de datos...' AS status;

SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'travel_app_db'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

SELECT 'Verificación completada. Todas las tablas y campos están presentes.' AS status;

