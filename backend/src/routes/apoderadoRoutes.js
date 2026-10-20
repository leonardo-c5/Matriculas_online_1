const express = require('express');
const router = express.Router();
const apoderadoController = require('../controllers/apoderadoController');

router.get('/', apoderadoController.obtenerApoderados);
router.post('/', apoderadoController.crearApoderado);

module.exports = router;