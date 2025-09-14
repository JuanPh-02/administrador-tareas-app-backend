// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, verifyEmail } = require('../controllers/auth.controller');

router.post('/registro', register);
router.post('/logueo', login);
router.get('/verificar-email', verifyEmail);


module.exports = router;
