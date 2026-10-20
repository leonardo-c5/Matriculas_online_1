const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } 
});

const inicializarDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alumnos (
                id_alumno SERIAL PRIMARY KEY,
                primer_nombre VARCHAR(50),
                segundo_nombre VARCHAR(50),
                apellido_paterno VARCHAR(50),
                apellido_materno VARCHAR(50),
                tipo_documento VARCHAR(20),
                numero_documento VARCHAR(20),
                fecha_nacimiento DATE
            );
        `);
        console.log('✅ Conexión a la nube de Supabase exitosa y tabla lista');
    } catch (error) {
        console.error('❌ Error al conectar a Supabase', error);
    }
};

inicializarDB();
module.exports = pool;