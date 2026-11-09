const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const estudianteRoutes = require('./src/routes/estudianteRoutes');
const apoderadoRoutes = require('./src/routes/apoderadoRoutes');
const gradoRoutes = require('./src/routes/gradoRoutes');
const documentoRoutes = require('./src/routes/documentoRoutes'); // NUEVA RUTA DE DOCUMENTOS
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const periodoRoutes = require('./src/routes/periodoRoutes'); // NUEVO

app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/apoderados', apoderadoRoutes);
app.use('/api/grados', gradoRoutes);
app.use('/api/documentos', documentoRoutes); 
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/periodos', periodoRoutes); // NUEVO

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});