const db = require('../config/db');
const { sendVerificationEmail, sendSharedTaskEmail } = require('../utils/email');
const dotenv = require('dotenv');

dotenv.config();

// Asignar tarea a un usuario (compartir) por correo
const shareTask = async (req, res) => {
    const { tareaId, correo, rol } = req.body;

    // Validar rol
    if (!['VISOR', 'EDITOR'].includes(rol)) {
        return res.status(400).json({ error: 'Rol no válido' });
    }

    try {
        // Buscar el usuario por su correo
        const [user] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuarioId = user[0].id;

        // Verificar que la tarea exista
        const [task] = await db.query('SELECT * FROM tareas WHERE id = ?', [tareaId]);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        // Verificar si la tarea ya está compartida con el usuario
        const [existingShare] = await db.query(
            'SELECT * FROM tareas_compartidas WHERE tareaId = ? AND usuarioId = ?',
            [tareaId, usuarioId]
        );
        if (existingShare.length > 0) {
            return res.status(400).json({ error: 'La tarea ya ha sido compartida con este usuario' });
        }

        // Asignar la tarea
        const [result] = await db.query(
            'INSERT INTO tareas_compartidas (tareaId, usuarioId, rol) VALUES (?, ?, ?)',
            [tareaId, usuarioId, rol]
        );

        // Enviar correo de notificación al usuario con el enlace para acceder a la tarea
        const taskLink = `http://localhost:${process.env.PORT}/api/tareas/obtener/${tareaId}`;
        await sendSharedTaskEmail(correo, task[0].titulo, task[0].descripcion, taskLink);

        res.status(201).json({ message: 'Tarea compartida correctamente. El usuario recibirá un correo.' });
    } catch (error) {
        console.error('Error al compartir tarea:', error);
        res.status(500).json({ error: 'Error al compartir tarea' });
    }
};

// Listar tareas compartidas con el usuario (por rol)
const getSharedTasks = async (req, res) => {
    const usuarioId = req.user.id; // El usuario autenticado

    try {
        // Obtener tareas compartidas con este usuario
        const [tasks] = await db.query(
            `SELECT t.id AS tareaId, t.titulo, t.descripcion, t.estado, s.rol, s.creado 
             FROM tareas_compartidas s 
             JOIN tareas t ON s.tareaId = t.id
             WHERE s.usuarioId = ?`,
            [usuarioId]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tienes tareas compartidas' });
        }

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas compartidas:', error);
        res.status(500).json({ error: 'Error al obtener tareas compartidas' });
    }
};

// Eliminar tarea compartida (solo el dueño de la tarea puede hacerlo)
const removeSharedTask = async (req, res) => {
    const tareaId = req.params.tareaId;
    const usuarioIdAutenticado = req.user.id; // El usuario autenticado
    const {correoCompartido} = req.body;

    try {
        // Verificar si el usuario es el dueño de la tarea
        const [task] = await db.query('SELECT * FROM tareas WHERE id = ? AND usuarioId = ?', [tareaId, usuarioIdAutenticado]);
        if (task.length === 0) {
            return res.status(403).json({ error: 'No estás autorizado para eliminar esta tarea' });
        }

        // Buscar el usuarioId del destinatario usando su correo electrónico
        const [user] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correoCompartido]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado con ese correo electrónico' });
        }

        const usuarioIdCompartido = user[0].id; // Obtener el id del usuario a quien se comparte la tarea

        // Verificar si la tarea está compartida con el usuario destinatario
        const [sharedTask] = await db.query('SELECT * FROM tareas_compartidas WHERE tareaId = ? AND usuarioId = ?', [tareaId, usuarioIdCompartido]);

        if (sharedTask.length === 0) {
            return res.status(404).json({ message: 'La tarea no está compartida con este usuario' });
        }

        // Eliminar la tarea compartida
        const [result] = await db.query('DELETE FROM tareas_compartidas WHERE tareaId = ? AND usuarioId = ?', [tareaId, usuarioIdCompartido]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró la tarea compartida' });
        }

        res.json({ message: 'Tarea compartida eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea compartida:', error);
        res.status(500).json({ error: 'Error al eliminar tarea compartida' });
    }
};

module.exports = {
    shareTask,
    getSharedTasks,
    removeSharedTask
};