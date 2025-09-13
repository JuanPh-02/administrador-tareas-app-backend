const express = require('express');
const router = express.Router();

const {
  createTask,
  getMyTasks,
  getSharedTasks,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require('../controllers/tasks.controller');

// Crear una nueva tarea
router.post('/nueva', createTask);

// Obtener tareas del usuario
router.get('/obtener', getMyTasks);

// Obtener tareas compartidas conmigo
router.get('/compartidas', getSharedTasks);

// Actualizar una tarea por ID
router.put('/actualizar/:id', updateTask);

// Actualizar estado de tarea por ID
router.patch('/:id/estado', updateTaskStatus);

// Eliminar una tarea por ID
router.delete('/eliminar/:id', deleteTask);

module.exports = router;
