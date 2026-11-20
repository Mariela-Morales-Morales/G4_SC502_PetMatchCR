CREATE DATABASE petmatchcr;

USE petmatchcr;

-- Tabla de especies
CREATE TABLE especies (
    id_especie INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especie VARCHAR(50) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(30) NOT NULL
);

-- Tabla de mascotas
CREATE TABLE mascotas (
    id_mascota INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_especie INT NOT NULL,
    raza VARCHAR(100),
    edad VARCHAR(30) NOT NULL,
    tamano VARCHAR(30) NOT NULL,
    descripcion VARCHAR(1000),
    fotografia VARCHAR(255),
    ubicacion VARCHAR(60) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    id_usuario INT NOT NULL,
    sexo VARCHAR(30),
    vacunas VARCHAR(30),
    esterilizada VARCHAR(30),
    FOREIGN KEY (id_especie) REFERENCES especies(id_especie),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de solicitudes de adopcion
CREATE TABLE solicitudes_adopcion (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_mascota INT NOT NULL,
    fecha_solicitud DATE NOT NULL,
    estado_solicitud VARCHAR(30) NOT NULL,
    telefono VARCHAR(20),
    vivienda VARCHAR(50),
    experiencia VARCHAR(255),
    motivo VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota)
);

-- Valores iniciales para el catalogo
INSERT INTO especies (nombre_especie)
VALUES ('Perro'), ('Gato');

-- Comprobacion inicial
SELECT * FROM especies;
