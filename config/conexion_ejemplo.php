<?php
// PetMatch CR - Conexion de ejemplo para GitHub.
// Copia este archivo como conexion.php y coloca tus datos locales alli.

$host = "localhost";
$dbname = "petmatchcr";
$user = "root";
$password = "TU_CONTRASENA_MYSQL";

try {
    $conexion = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password
    );

    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {
    die("Error de conexion: " . $e->getMessage());
}