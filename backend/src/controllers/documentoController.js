const db = require('../config/database');

const obtenerDocumentos = async (req, res) => {
  try {
    // Unimos la tabla documentos con alumnos para enviar todos los datos juntos al Frontend
    const result = await db.query(`
      SELECT d.id_documento, d.tipo_documento, d.estado, d.observacion, 
             a.id_alumno, a.numero_documento, a.primer_nombre, a.apellido_paterno
      FROM documentos d
      JOIN alumnos a ON d.id_alumno = a.id_alumno
      ORDER BY d.id_documento DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo documentos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarDocumento = async (req, res) => {
  const { id } = req.params;
  const { estado, observacion } = req.body;
  try {
    const result = await db.query(
      'UPDATE documentos SET estado = $1, observacion = $2 WHERE id_documento = $3 RETURNING *',
      [estado, observacion || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando documento:', err);
    res.status(500).json({ error: 'Error al actualizar documento' });
  }
};

module.exports = { obtenerDocumentos, actualizarDocumento };