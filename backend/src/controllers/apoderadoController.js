const db = require('../config/database');

exports.obtenerApoderados = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM apoderados ORDER BY id_apoderado DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener apoderados' });
    }
};

exports.crearApoderado = async (req, res) => {
    try {
        const { nombres, apellidos, tipo_documento, numero_documento, telefono, correo, direccion } = req.body;
        const result = await db.query(
            `INSERT INTO apoderados (nombres, apellidos, tipo_documento, numero_documento, telefono, correo, direccion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [nombres, apellidos, tipo_documento, numero_documento, telefono, correo, direccion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar apoderado' });
    }
};