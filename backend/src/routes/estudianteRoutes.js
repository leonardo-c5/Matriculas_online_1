const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

router.get('/', estudianteController.obtenerEstudiantes);
router.post('/', estudianteController.crearEstudiante);
router.delete('/:id', estudianteController.eliminarEstudiante);
// NUEVA RUTA PARA LOS BOTONES APROBAR/OBSERVAR
router.put('/:id/estado', estudianteController.actualizarEstado); 

module.exports = router;