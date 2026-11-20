<?php
// PetMatch CR - Persona 1. Ficha de una mascota registrada en MySQL.
// Basado en el ejemplo editar.php del profesor (semana 10).

require_once "../../config/conexion.php";

// Recibimos el identificador desde la dirección de la página.
$id = $_GET["id"] ?? null;

if (!$id || !is_numeric($id)) {
    die("Mascota no encontrada. Regresa al catálogo.");
}

// Buscamos solamente la mascota seleccionada.
$sql = "SELECT * FROM mascotas WHERE id_mascota = :id";
$consulta = $conexion->prepare($sql);
$consulta->execute([":id" => $id]);
$mascota = $consulta->fetch(PDO::FETCH_ASSOC);

if (!$mascota) {
    die("Mascota no encontrada. Regresa al catálogo.");
}

// Consultamos el nombre de la especie según su identificador.
$sqlEspecie = "SELECT * FROM especies WHERE id_especie = :id";
$consultaEspecie = $conexion->prepare($sqlEspecie);
$consultaEspecie->execute([":id" => $mascota["id_especie"]]);
$especie = $consultaEspecie->fetch(PDO::FETCH_ASSOC);

// Consultamos el responsable ya registrado en MySQL.
$sqlUsuario = "SELECT * FROM usuarios WHERE id_usuario = :id";
$consultaUsuario = $conexion->prepare($sqlUsuario);
$consultaUsuario->execute([":id" => $mascota["id_usuario"]]);
$usuario = $consultaUsuario->fetch(PDO::FETCH_ASSOC);

$nombreEspecie = $especie ? $especie["nombre_especie"] : "No especificada";
$nombreResponsable = $usuario ? $usuario["nombre"] : "Sin responsable registrado";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PetMatch CR | Conoce a <?= htmlspecialchars($mascota["nombre"]) ?></title>
    <link rel="icon" href="../../img/logos/05_Favicon_PetMatchCR.png">
    <link rel="stylesheet" href="../../css/estilos.css">
</head>
<body>
    <header class="encabezado">
        <nav class="navegacion">
            <a href="../../index.html" class="logo">
                <img src="../../img/logos/04_Logo_Blanco_Para_Fondo_Verde.png" alt="PetMatch CR">
            </a>
            <ul class="menu">
                <li><a href="../../index.html">Inicio</a></li>
                <li><a href="../index.php" class="activo">Mascotas</a></li>
                <li><a href="../../adopciones/solicitar-adopcion.html">Adoptar</a></li>
                <li><a href="../../index.html#adopcion">Sobre la adopción</a></li>
                <li><a href="../../usuarios/perfil.html">Mi perfil</a></li>
                <li><a href="../../index.html#contacto">Contacto</a></li>
            </ul>
            <a href="../../usuarios/inicioSesion.html" class="boton-ingresar">Ingresar</a>
        </nav>
    </header>

    <main class="pagina-detalle">
        <div class="contenedor-detalle">
            <a href="../index.php" class="volver-catalogo">Volver al catálogo</a>

            <div class="titulo-detalle">
                <div>
                    <p class="subtitulo-detalle">Conoce a tu próximo compañero</p>
                    <h1><?= htmlspecialchars($mascota["nombre"]) ?></h1>
                    <p class="descripcion-detalle">
                        <?= htmlspecialchars($nombreEspecie) ?> ·
                        <?= htmlspecialchars($mascota["raza"]) ?> ·
                        <?= htmlspecialchars($mascota["edad"]) ?> ·
                        <?= htmlspecialchars($mascota["tamano"]) ?> ·
                        <?= htmlspecialchars($mascota["ubicacion"]) ?>
                    </p>
                </div>
                <span class="disponibilidad-detalle">
                    <?= htmlspecialchars($mascota["estado"]) ?>
                </span>
            </div>

            <!-- Las seis fotografías tienen la misma carpeta y nombre base. -->
            <section class="galeria-mascota" aria-label="Fotografías de <?= htmlspecialchars($mascota["nombre"]) ?>">
                <?php for ($numero = 1; $numero <= 6; $numero++): ?>
                    <img
                        <?php if ($numero === 1): ?>class="foto-detalle-principal"<?php endif; ?>
                        src="../../<?= htmlspecialchars(str_replace("-1.jpg", "-" . $numero . ".jpg", $mascota["fotografia"])) ?>"
                        alt="<?= htmlspecialchars($mascota["nombre"]) ?>, fotografía <?= $numero ?>">
                <?php endfor; ?>
            </section>

            <div class="informacion-detalle">
                <section class="panel-detalle historia-detalle">
                    <h2>La historia de <?= htmlspecialchars($mascota["nombre"]) ?></h2>
                    <p><?= htmlspecialchars($mascota["descripcion"]) ?></p>

                    <h2 class="subtitulo-caracteristicas">Características</h2>
                    <div class="lista-caracteristicas">
                        <div><span>Especie</span><strong><?= htmlspecialchars($nombreEspecie) ?></strong></div>
                        <div><span>Raza</span><strong><?= htmlspecialchars($mascota["raza"]) ?></strong></div>
                        <div><span>Edad</span><strong><?= htmlspecialchars($mascota["edad"]) ?></strong></div>
                        <div><span>Sexo</span><strong><?= htmlspecialchars($mascota["sexo"]) ?></strong></div>
                        <div><span>Tamaño</span><strong><?= htmlspecialchars($mascota["tamano"]) ?></strong></div>
                        <div><span>Ubicación</span><strong><?= htmlspecialchars($mascota["ubicacion"]) ?></strong></div>
                        <div><span>Estado</span><strong><?= htmlspecialchars($mascota["estado"]) ?></strong></div>
                    </div>
                </section>

                <aside class="panel-detalle panel-adopcion">
                    <h2>Información de adopción</h2>
                    <p class="descripcion-adopcion">
                        Antes de adoptar, es importante conocer las necesidades de la mascota.
                    </p>
                    <div class="dato-adopcion">
                        <span>Vacunación</span>
                        <strong><?= htmlspecialchars($mascota["vacunas"]) ?></strong>
                    </div>
                    <div class="dato-adopcion">
                        <span>Esterilización</span>
                        <strong><?= htmlspecialchars($mascota["esterilizada"]) ?></strong>
                    </div>
                    <div class="dato-adopcion">
                        <span>Responsable</span>
                        <strong><?= htmlspecialchars($nombreResponsable) ?></strong>
                    </div>
                    <?php if ($mascota["estado"] === "Disponible"): ?>
                        <a href="../../adopciones/solicitar-adopcion.html" class="boton-solicitar">
                            Solicitar adopción
                        </a>
                        <p class="aviso-solicitud">
                            Selecciona a <?= htmlspecialchars($mascota["nombre"]) ?> en el formulario de adopciones.
                        </p>
                    <?php else: ?>
                        <p class="aviso-solicitud">Esta mascota ya tiene una solicitud de adopción en proceso.</p>
                    <?php endif; ?>
                </aside>
            </div>
            <p class="aviso-prototipo" style="margin-top:24px">
                Proyecto académico: mascotas, historias y datos médicos simulados.
                Las fotografías son ilustrativas y no representan anuncios reales de adopción.
            </p>
        </div>
    </main>

    <footer class="pie-pagina" id="contacto">
        <p>PetMatch CR — Plataforma de adopción responsable</p>
        <p>Un hogar cambia una vida. ♡</p>
    </footer>
</body>
</html>
