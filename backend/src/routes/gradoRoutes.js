const express = require('express');
const router = express.Router();
const gradoController = require('../controllers/gradoController');

// GET: Obtiene todos los salones
router.get('/', gradoController.obtenerGrados);

// POST: Crea un nuevo salón en la base de datos
router.post('/', gradoController.crearGrado);

// PUT: Asigna la vacante y aprueba al estudiante (LA RUTA QUE FALTABA)
router.put('/asignar', gradoController.asignarVacante);

module.exports = router;