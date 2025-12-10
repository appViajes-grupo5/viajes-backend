const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

async function initDatabase() {
  let connection;
  
  console.log(colors.cyan + '\n🚀 Iniciando script de configuración de Base de Datos...' + colors.reset);
  
  // 1. Validar variables de entorno críticas (Mejora: Validación previa)
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.error(colors.red + '❌ Error: Faltan variables de entorno (DB_HOST, DB_USER o DB_NAME).' + colors.reset);
    console.log(colors.yellow + '👉 Revisa tu archivo .env antes de continuar.' + colors.reset);
    process.exit(1);
  }
  
  try {
    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true, 
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    };

    console.log(`🔌 Conectando a ${colors.yellow}${connectionConfig.host}:${connectionConfig.port}${colors.reset}...`);
    
    // Conectamos sin seleccionar BBDD inicialmente para poder crearla si no existe
    connection = await mysql.createConnection(connectionConfig);
    console.log(colors.green + '✅ Conectado a MySQL' + colors.reset);

    // 2. Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'db', 'init_database.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No se encuentra el archivo SQL en: ${sqlPath}`);
    }

    console.log(`📄 Leyendo esquema desde ${colors.yellow}db/init_database.sql${colors.reset}...`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 3. Ejecutar inicialización
    console.log('🚀 Ejecutando script de inicialización...');
    await connection.query(sql);
    
    console.log(colors.green + '✅ Base de datos actualizada exitosamente!' + colors.reset);

    // 4. Verificación final (Listar tablas reales)
    // Aseguramos usar la BBDD correcta antes de listar
    await connection.query(`USE ${process.env.DB_NAME}`);
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\n📋 Tablas verificadas en la base de datos:');
    if (tables.length === 0) {
      console.log(colors.yellow + '   (No se encontraron tablas, verifica el script SQL)' + colors.reset);
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   ✓ ${tableName}`);
      });
    }

  } catch (error) {
    console.error(colors.red + '\n❌ Error crítico al inicializar la base de datos:' + colors.reset);
    console.error(error.message);

    // Pistas inteligentes de error
    if (error.code === 'ECONNREFUSED') {
      console.log(colors.yellow + '💡 Pista: Asegúrate de que tu servidor MySQL esté encendido y el puerto sea correcto.' + colors.reset);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log(colors.yellow + '💡 Pista: Revisa tu usuario y contraseña en el archivo .env' + colors.reset);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log(colors.yellow + '💡 Pista: Parece que la base de datos no se pudo crear o seleccionar.' + colors.reset);
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log(colors.cyan + '\n👋 Conexión cerrada.' + colors.reset);
    }
  }
}

initDatabase();