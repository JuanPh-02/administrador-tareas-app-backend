-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS taskmanagerdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE taskmanagerdb;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    esVerificado BOOLEAN DEFAULT FALSE,
    tokenVerificacion VARCHAR(255),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente', 'en_progreso', 'completada') DEFAULT 'pendiente',
    usuarioId INT NOT NULL,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de tareas compartidas
CREATE TABLE compartidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tareaId INT NOT NULL,
    usuarioId INT NOT NULL,
    rol ENUM('VISOR', 'EDITOR') NOT NULL,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY compartidoUnico (tareaId, usuarioId),
    FOREIGN KEY (tareaId) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE
);