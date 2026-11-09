const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.obtenerUsuarios);
router.post('/', usuarioController.crearUsuario);
router.put('/:id/estado', usuarioController.cambiarEstadoUsuario);

module.exports = router;