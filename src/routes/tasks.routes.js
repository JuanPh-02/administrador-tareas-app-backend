const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/ping', (req, res) => {
  res.json({ message: 'pong 🏓' });
});

router.post('/nueva-tarea', (req, res) => {
  res.json({ message: 'Creo la tarea correctamente' });
});

router.put('/actualizar-tarea',  (req, res) => {
  res.json({ message: 'Actualizó la tarea correctamente' });
})

module.exports = router;
