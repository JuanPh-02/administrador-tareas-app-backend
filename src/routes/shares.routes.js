const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/ping', (req, res) => {
  res.json({ message: 'pong 🏓' });
});

module.exports = router;
