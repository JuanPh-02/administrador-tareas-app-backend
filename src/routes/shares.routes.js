const express = require('express');
const { shareTask, getSharedTasks, removeSharedTask } = require('../controllers/shares.controller');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Ruta para compartir una tarea
router.post('/compartir', authenticateToken, shareTask);

// Ruta para obtener las tareas compartidas con el usuario
router.get('/obtener', authenticateToken, getSharedTasks);

// Ruta para eliminar una tarea compartida
router.delete('/eliminar/:tareaId', authenticateToken, removeSharedTask);

module.exports = router;
