const db = require('../config/database');

const obtenerUsuarios = async (req, res) => {
  try {
    const result = await db.query('SELECT id_usuario, nombres, email, rol, estado, fecha_creacion FROM usuarios ORDER BY id_usuario DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const crearUsuario = async (req, res) => {
  const { nombres, correo, password, rol } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO usuarios (nombres, email, password_hash, rol, estado) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombres, email, rol, estado',
      [nombres, correo, password, rol || 'Secretaria', 'Activo']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario. ¿El correo ya existe?' });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const result = await db.query(
      'UPDATE usuarios SET estado = $1 WHERE id_usuario = $2 RETURNING id_usuario, nombres, estado',
      [estado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando estado:', err);
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
};

module.exports = { obtenerUsuarios, crearUsuario, cambiarEstadoUsuario };