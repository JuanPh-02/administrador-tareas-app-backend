const pool = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// Registro de usuario
const register = async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: 'No se enviaron datos en la solicitud' });
    }

    const { nombre, correo, password } = req.body;
    //   const nombre = req.body.nombre;
    //   const correo = req.body.correo;
    //   const password = req.body.password;

    // Validación de campos requeridos
    if (!nombre || !correo || !password) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios: nombre, correo y password',
        });
    }

    try {
        // Verificar si el usuario ya existe
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hashear la contraseña
        const hashed = await hashPassword(password);

        // Insertar usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
            [nombre, correo, hashed]
        );

        res.status(201).json({ message: 'Usuario registrado correctamente', usuarioId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Login
const login = async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: 'No se enviaron datos en la solicitud' });
    }

    const { correo, password } = req.body;

    // Validación de campos requeridos
    if (!correo || !password) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios: correo y password',
        });
    }

    try {
        // Verificar si el usuario existe
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = rows[0];

        // Comparar contraseñas
        const match = await comparePassword(password, usuario.password);
        if (!match) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token
        const token = generateToken({ id: usuario.id, nombre: usuario.nombre });

        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    register,
    login,
};
