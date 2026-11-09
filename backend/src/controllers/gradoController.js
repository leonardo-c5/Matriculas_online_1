const db = require('../config/database');

const obtenerGrados = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM grados_secciones ORDER BY grado, seccion');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo grados:', err.message);
    res.status(500).json({ error: 'Error al obtener los grados y secciones' });
  }
};

const crearGrado = async (req, res) => {
  try {
    const { grado, seccion, capacidad } = req.body;
    
    // Inserta usando los nombres reales de tu tabla en Supabase (capacidad y matriculados)
    const result = await db.query(
      'INSERT INTO grados_secciones (grado, seccion, capacidad, matriculados) VALUES ($1, $2, $3, 0) RETURNING *',
      [grado, seccion, capacidad || 30]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando grado:', err.message);
    res.status(500).json({ error: 'Error al crear la nueva sección' });
  }
};

const asignarVacante = async (req, res) => {
  const { id_alumno, id_aula } = req.body;
  
  try {
    // 1. Aumentar el contador de matriculados en el aula seleccionada (+1)
    await db.query(
      'UPDATE grados_secciones SET matriculados = matriculados + 1 WHERE id_aula = $1',
      [id_aula]
    );
    
    // 2. Asignar el id_aula al alumno y cambiar su estado a 'Aprobada'
    await db.query(
      'UPDATE alumnos SET estado = $1, id_aula = $2 WHERE id_alumno = $3',
      ['Aprobada', id_aula, id_alumno]
    );

    res.json({ message: 'Vacante asignada y matrícula aprobada con éxito' });
  } catch (err) {
    console.error('Error asignando vacante:', err);
    res.status(500).json({ error: 'Error interno al procesar la matrícula' });
  }
};

module.exports = {
  obtenerGrados,
  crearGrado,
  asignarVacante
};