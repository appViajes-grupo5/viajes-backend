const { pool } = require('../config/db');
const { connect } = require('../routes/authRoutes');
require('dotenv').config();

const pool = new pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = { pool };

