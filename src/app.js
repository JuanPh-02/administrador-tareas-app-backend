const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const taskRoutes = require('./routes/tasks.routes');
const shareRoutes = require('./routes/shares.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/autenticacion', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/tareas', taskRoutes);
app.use('/api/compartido', shareRoutes);
// app.use('/', (req, res) => res.json("Bienvenido al Backend"))

module.exports = app;
