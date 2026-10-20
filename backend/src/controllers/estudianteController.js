const db = require('../config/database');

exports.obtenerEstudiantes = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM alumnos ORDER BY id_alumno DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
};

exports.crearEstudiante = async (req, res) => {
    try {
        const { 
            primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, 
            tipo_documento, numero_documento, fecha_nacimiento, grado,
            apo_nombres, apo_apellidos, apo_dni, apo_telefono, apo_correo 
        } = req.body;
        
        const estado = 'En proceso'; 
        
        const result = await db.query(
            `INSERT INTO alumnos 
            (primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, tipo_documento, numero_documento, fecha_nacimiento, grado, estado, apo_nombres, apo_apellidos, apo_dni, apo_telefono, apo_correo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, tipo_documento, numero_documento, fecha_nacimiento, grado, estado, apo_nombres, apo_apellidos, apo_dni, apo_telefono, apo_correo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
};

exports.eliminarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM alumnos WHERE id_alumno = $1', [id]);
        res.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
};

exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const result = await db.query(
            'UPDATE alumnos SET estado = $1 WHERE id_alumno = $2 RETURNING *',
            [estado, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
};