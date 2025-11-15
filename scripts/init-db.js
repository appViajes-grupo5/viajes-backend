const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
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

    console.log(`🔌 Conectando a ${connectionConfig.host}:${connectionConfig.port}...`);

    connection = await mysql.createConnection(connectionConfig);

    console.log('✅ Conectado a MySQL');

    const sqlPath = path.join(__dirname, '..', 'db', 'init_database.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Leyendo script SQL...');

    const dbName = process.env.DB_NAME || 'grupo5_viajes';
    const dbExists = process.env.DB_ALREADY_EXISTS === 'true';
    
    if (dbExists) {
      console.log(`ℹ️  Base de datos ${dbName} ya existe, omitiendo CREATE DATABASE...`);
      sql = sql.replace(/CREATE DATABASE[^;]+;/gi, '');
      sql = sql.replace(/USE[^;]+;/gi, `USE ${dbName};`);
    }

    console.log('🚀 Ejecutando script de inicialización...');
    await connection.query(sql);

    console.log('✅ Base de datos creada exitosamente!');
    console.log('📊 Tablas creadas:');
    console.log('   - users');
    console.log('   - trips');
    console.log('   - trip_participants');
    console.log('   - ratings');
    console.log('   - trip_comments');
    console.log('   - notifications');

    await connection.query('USE grupo5_viajes');
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\n📋 Tablas en la base de datos:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   ✓ ${tableName}`);
    });

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Conexión cerrada');
    }
  }
}

initDatabase();

