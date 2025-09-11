// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

router.post('/registro', register);
router.post('/logueo', login);

module.exports = router;
