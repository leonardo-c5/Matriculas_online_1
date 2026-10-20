const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const estudianteRoutes = require('./src/routes/estudianteRoutes');
const apoderadoRoutes = require('./src/routes/apoderadoRoutes'); // LÍNEA NUEVA

app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/apoderados', apoderadoRoutes); // LÍNEA NUEVA

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});