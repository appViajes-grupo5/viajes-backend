const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');
const authRoutes = require('./routes/authRoutes');
const tripCommentsRoutes = require('./routes/tripCommentsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

//  USAMOS routers (tienen que ser funciones)
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/trip-comments', tripCommentsRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
