const db = require('../config/db');
const { sendVerificationEmail } = require('../utils/email');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const crypto = require('crypto');

const dotenv = require('dotenv');

dotenv.config();

// Registro de usuario
const register = async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: 'No se enviaron datos en la solicitud' });
    }

    const { nombre, correo, password } = req.body;

    // Validación de campos requeridos
    if (!nombre || !correo || !password) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios: nombre, correo y password',
        });
    }

    try {
        // Verificar si el usuario ya existe
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hashear la contraseña
        const hashedPassword = await hashPassword(password);

        // Generacion token de verificacion
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insertar usuario
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, correo, password, tokenVerificacion) VALUES (?, ?, ?, ?)',
            [nombre, correo, hashedPassword, verificationToken]
        );

        // Enviar correo de verificación
        const verificationLink = `http://localhost:${process.env.PORT}/api/autenticacion/verificar-email?token=${verificationToken}`;
        await sendVerificationEmail(correo, verificationLink);

        res.status(201).json({ message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const [users] = await db.query('SELECT * FROM usuarios WHERE tokenVerificacion = ?', [token]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        await db.query(
            'UPDATE usuarios SET esVerificado = 1, tokenVerificacion = NULL WHERE id = ?',
            [user.id]
        );

        res.status(200).json({ message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' });

    } catch (error) {
        console.error('Error al verificar correo:', error);
        res.status(500).json({ error: 'Error al verificar el correo' });
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
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = rows[0];

        if (!usuario.esVerificado) {
            return res.status(403).json({ error: 'Verifica tu correo antes de iniciar sesión' });
        }

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
    verifyEmail
};
