const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/periodoController');

router.get('/', periodoController.obtenerPeriodos);
router.post('/', periodoController.crearPeriodo);
router.put('/:id/activar', periodoController.activarPeriodo);

module.exports = router;