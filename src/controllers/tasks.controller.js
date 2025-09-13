const db = require('../config/db');

// Crear una tarea
const createTask = async (req, res) => {
    const { titulo, descripcion, estado } = req.body;
    // const userId = req.user.id; 
    const usuarioId = 3;

    try {
        const [result] = await db.query(
            'INSERT INTO tareas (titulo, descripcion, estado, usuarioId) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, estado, usuarioId]
        );

        res.status(201).json({ message: 'Tarea creada', tareaId: result.insertId });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ error: `Error al crear tarea: ${error}` });
    }
};

// Listar tareas del usuario (propias)
const getMyTasks = async (req, res) => {
    // const userId = req.user.id;
    const usuarioId = 2;

    try {
        const [tasks] = await db.query(
            'SELECT * FROM tareas WHERE usuarioId = ?',
            [usuarioId]
        );
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};

// Listar tareas compartidas conmigo
const getSharedTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const [tasks] = await db.query(
            `SELECT t.*, s.role FROM tareas t
             JOIN shares s ON t.id = s.id
             WHERE s.usuarioId = ?`,
            [userId]
        );
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas compartidas:', error);
        res.status(500).json({ error: 'Error al obtener tareas compartidas' });
    }
};

// Actualizar tarea (solo dueño)
const updateTask = async (req, res) => {
    const tareaId = req.params.id;
    // const userId = req.user.id;
    const usuarioId = 2;
    const { titulo, descripcion, estado } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ? WHERE id = ? AND usuarioId = ?',
            [titulo, descripcion, estado, tareaId, usuarioId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
        }

        res.json({ message: 'Tarea actualizada' });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
};

// Cambiar solo el estado de una tarea (solo dueño)
const updateTaskStatus = async (req, res) => {
    const tareaId = req.params.id;
    const { estado } = req.body;
    const usuarioId = 2; // Temporal mientras implementas JWT

    try {
        const [result] = await db.query(
            'UPDATE tareas SET estado = ? WHERE id = ? AND usuarioId = ?',
            [estado, tareaId, usuarioId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
        }

        res.json({ message: 'Estado de tarea actualizado' });
    } catch (error) {
        console.error('Error al actualizar estado de tarea:', error);
        res.status(500).json({ error: 'Error al actualizar estado de tarea' });
    }
};

// Eliminar tarea (solo dueño)
const deleteTask = async (req, res) => {
    const tareaId = req.params.id;
    // const userId = req.user.id;
    const usuarioId = 2;

    try {
        const [result] = await db.query(
            'DELETE FROM tareas WHERE id = ? AND usuarioId = ?',
            [tareaId, usuarioId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
        }

        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
};

module.exports = {
    createTask,
    getMyTasks,
    getSharedTasks,
    updateTask,
    updateTaskStatus,
    deleteTask
}
