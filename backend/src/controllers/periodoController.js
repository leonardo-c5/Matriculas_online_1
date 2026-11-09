const db = require('../config/database');

const obtenerPeriodos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM periodos ORDER BY id_periodo DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo periodos:', err);
    res.status(500).json({ error: 'Error al obtener periodos académicos' });
  }
};

const crearPeriodo = async (req, res) => {
  const { nombre_periodo, fecha_inicio, fecha_fin } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO periodos (nombre_periodo, fecha_inicio, fecha_fin, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre_periodo, fecha_inicio, fecha_fin, 'Cerrado']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando periodo:', err);
    res.status(500).json({ error: 'Error al registrar el periodo académico' });
  }
};

const activarPeriodo = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero cerramos todos los periodos
    await db.query("UPDATE periodos SET estado = 'Cerrado'");
    // Luego activamos el seleccionado
    const result = await db.query(
      "UPDATE periodos SET estado = 'Activo' WHERE id_periodo = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error activando periodo:', err);
    res.status(500).json({ error: 'Error al activar el periodo escolar' });
  }
};

module.exports = { obtenerPeriodos, crearPeriodo, activarPeriodo };