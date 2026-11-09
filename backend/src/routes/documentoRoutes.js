const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');

router.get('/', documentoController.obtenerDocumentos);
router.put('/:id/estado', documentoController.actualizarDocumento);

module.exports = router;