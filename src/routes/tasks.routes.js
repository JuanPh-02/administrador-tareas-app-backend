const express = require('express');
const router = express.Router();

const {
  createTask,
  getMyTasks,
  getSharedTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getMyTaskById
} = require('../controllers/tasks.controller');
const authenticateToken = require('../middleware/auth');

// Crear una nueva tarea
router.post('/nueva', authenticateToken, createTask);

// Obtener tareas del usuario
router.get('/obtener', authenticateToken, getMyTasks);

// Obtener tarea por ID
router.get('/obtener/:id', authenticateToken, getMyTaskById);

// Actualizar una tarea por ID
router.put('/actualizar/:id', authenticateToken, updateTask);

// Actualizar estado de tarea por ID
router.patch('/:id/estado', authenticateToken, updateTaskStatus);

// Eliminar una tarea por ID
router.delete('/eliminar/:id', authenticateToken, deleteTask);

module.exports = router;
