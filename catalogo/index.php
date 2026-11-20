<?php
// PetMatch CR: catálogo conectado a MySQL.

require_once "../config/conexion.php";

$sql = "SELECT * FROM mascotas ORDER BY id_mascota";
$consulta = $conexion->prepare($sql);
$consulta->execute();
$mascotas = $consulta->fetchAll(PDO::FETCH_ASSOC);

$sqlEspecies = "SELECT * FROM especies ORDER BY id_especie";
$consultaEspecies = $conexion->prepare($sqlEspecies);
$consultaEspecies->execute();
$especies = $consultaEspecies->fetchAll(PDO::FETCH_ASSOC);

$nombresEspecies = [];
foreach ($especies as $especie) {
    $nombresEspecies[$especie["id_especie"]] = $especie["nombre_especie"];
}

// Obtener las razas y ubicaciones
$razas = [];
$ubicaciones = [];
foreach ($mascotas as $mascota) {
    $razas[$mascota["raza"]] = $mascota["raza"];
    $ubicaciones[$mascota["ubicacion"]] = $mascota["ubicacion"];
}

$filtroEspecie = $_GET["especie"] ?? "";
$filtroRaza = $_GET["raza"] ?? "";
$filtroEdad = $_GET["edad"] ?? "";
$filtroTamano = $_GET["tamano"] ?? "";
$filtroUbicacion = $_GET["ubicacion"] ?? "";
$filtroEstado = $_GET["estado"] ?? "";

// Aplicar los seis filtros
$mascotasFiltradas = [];
foreach ($mascotas as $mascota) {
    if ($filtroEspecie !== "" && $mascota["id_especie"] != $filtroEspecie) {
        continue;
    }
    if ($filtroRaza !== "" && $mascota["raza"] !== $filtroRaza) {
        continue;
    }
    if ($filtroTamano !== "" && $mascota["tamano"] !== $filtroTamano) {
        continue;
    }
    if ($filtroUbicacion !== "" && $mascota["ubicacion"] !== $filtroUbicacion) {
        continue;
    }
    if ($filtroEstado !== "" && $mascota["estado"] !== $filtroEstado) {
        continue;
    }

    if ($filtroEdad !== "") {
        if (strpos($mascota["edad"], "mes") !== false) {
            $grupoEdad = "cachorro";
        } else {
            $anios = (int) $mascota["edad"];
            if ($anios < 1) {
                $grupoEdad = "cachorro";
            } elseif ($anios <= 3) {
                $grupoEdad = "joven";
            } else {
                $grupoEdad = "adulto";
            }
        }
        if ($grupoEdad !== $filtroEdad) {
            continue;
        }
    }

    $mascotasFiltradas[] = $mascota;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PetMatch CR | Catálogo de mascotas</title>
    <link rel="icon" href="../img/logos/05_Favicon_PetMatchCR.png">
    <link rel="stylesheet" href="../css/estilos.css">
    <link rel="stylesheet" href="estilos-catalogo.css">
    <script src="../js/filtrosCatalogo.js" defer></script>
</head>
<body>
    <header class="encabezado">
        <nav class="navegacion">
            <a href="../index.html" class="logo">
                <img src="../img/logos/04_Logo_Blanco_Para_Fondo_Verde.png" alt="PetMatch CR">
            </a>
            <ul class="menu">
                <li><a href="../index.html">Inicio</a></li>
                <li><a href="index.php" class="activo">Mascotas</a></li>
                <li><a href="../adopciones/solicitar-adopcion.html">Adoptar</a></li>
                <li><a href="../index.html#adopcion">Sobre la adopción</a></li>
                <li><a href="../usuarios/perfil.html">Mi perfil</a></li>
                <li><a href="../index.html#contacto">Contacto</a></li>
            </ul>
            <a href="../usuarios/inicioSesion.html" class="boton-ingresar">Ingresar</a>
        </nav>
    </header>

    <main class="catalogo-dinamico">
        <section class="presentacion-catalogo">
            <p class="etiqueta-catalogo">Pequeñas historias, grandes oportunidades</p>
            <h1>Encuentra a tu compañero ideal <span>♡</span></h1>
            <p class="descripcion-catalogo">
                Conoce a los perros y gatos que esperan una segunda oportunidad.
                Tal vez tu nuevo mejor amigo esté aquí.
            </p>
        </section>

        <section class="contenido-catalogo">
            <aside class="panel-filtros">
                <div class="encabezado-filtros">
                    <h2>Filtrar mascotas</h2>
                    <p>Selecciona las características que prefieres</p>
                </div>

                <form method="GET" action="index.php" class="formulario-filtros">
                    <div class="grupo-filtro">
                        <label for="especie">Especie</label>
                        <select id="especie" name="especie">
                            <option value="">Todas las especies</option>
                            <?php foreach ($especies as $especie): ?>
                                <option value="<?= $especie['id_especie'] ?>"
                                    <?php if ($filtroEspecie == $especie['id_especie']) echo 'selected'; ?>>
                                    <?= htmlspecialchars($especie['nombre_especie']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="grupo-filtro">
                        <label for="raza">Raza</label>
                        <select id="raza" name="raza">
                            <option value="">Todas las razas</option>
                            <?php foreach ($razas as $raza): ?>
                                <option value="<?= htmlspecialchars($raza) ?>"
                                    <?php if ($filtroRaza === $raza) echo 'selected'; ?>>
                                    <?= htmlspecialchars($raza) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="grupo-filtro">
                        <label for="edad">Edad</label>
                        <select id="edad" name="edad">
                            <option value="">Todas las edades</option>
                            <option value="cachorro" <?php if ($filtroEdad === 'cachorro') echo 'selected'; ?>>Menos de 1 año</option>
                            <option value="joven" <?php if ($filtroEdad === 'joven') echo 'selected'; ?>>De 1 a 3 años</option>
                            <option value="adulto" <?php if ($filtroEdad === 'adulto') echo 'selected'; ?>>Más de 3 años</option>
                        </select>
                    </div>

                    <div class="grupo-filtro">
                        <label for="tamano">Tamaño</label>
                        <select id="tamano" name="tamano">
                            <option value="">Todos los tamaños</option>
                            <option value="Pequeño" <?php if ($filtroTamano === 'Pequeño') echo 'selected'; ?>>Pequeño</option>
                            <option value="Mediano" <?php if ($filtroTamano === 'Mediano') echo 'selected'; ?>>Mediano</option>
                            <option value="Grande" <?php if ($filtroTamano === 'Grande') echo 'selected'; ?>>Grande</option>
                        </select>
                    </div>

                    <div class="grupo-filtro">
                        <label for="ubicacion">Ubicación</label>
                        <select id="ubicacion" name="ubicacion">
                            <option value="">Todas las ubicaciones</option>
                            <?php foreach ($ubicaciones as $ubicacion): ?>
                                <option value="<?= htmlspecialchars($ubicacion) ?>"
                                    <?php if ($filtroUbicacion === $ubicacion) echo 'selected'; ?>>
                                    <?= htmlspecialchars($ubicacion) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="grupo-filtro">
                        <label for="estado">Estado</label>
                        <select id="estado" name="estado">
                            <option value="">Todos los estados</option>
                            <option value="Disponible" <?php if ($filtroEstado === 'Disponible') echo 'selected'; ?>>Disponible</option>
                            <option value="En proceso" <?php if ($filtroEstado === 'En proceso') echo 'selected'; ?>>En proceso</option>
                        </select>
                    </div>

                    <div class="acciones-filtros">
                        <p class="nota-filtros">Selecciona tus preferencias para encontrar a tu compañero ideal.</p>
                        <button type="submit" class="boton-buscar-catalogo">Buscar mascotas</button>
                        <a href="index.php" class="boton-limpiar-catalogo">Limpiar filtros</a>
                    </div>
                </form>
            </aside>

            <div class="seccion-mascotas">
                <div class="encabezado-resultados">
                    <div>
                        <h2>Mascotas que buscan un hogar</h2>
                        <p>Explora las mascotas registradas en nuestra base de datos.</p>
                    </div>
                    <span class="cantidad-mascotas">
                        <?= count($mascotasFiltradas) ?>
                        <?php if (count($mascotasFiltradas) === 1): ?>mascota<?php else: ?>mascotas<?php endif; ?>
                    </span>
                </div>

                <div class="cuadricula-mascotas">
                    <?php foreach ($mascotasFiltradas as $mascota): ?>
                        <article class="tarjeta-mascota" id="mascota-<?= $mascota['id_mascota'] ?>">
                            <div class="foto-mascota">
                                <img src="../<?= htmlspecialchars($mascota['fotografia']) ?>"
                                    alt="Fotografía de <?= htmlspecialchars($mascota['nombre']) ?>">
                                <span class="estado-mascota">
                                    <?= htmlspecialchars($mascota['estado']) ?>
                                </span>
                            </div>
                            <div class="datos-mascota">
                                <div class="titulo-mascota">
                                    <h3><?= htmlspecialchars($mascota['nombre']) ?></h3>
                                </div>
                                <p class="tipo-mascota">
                                    <?= htmlspecialchars($nombresEspecies[$mascota['id_especie']]) ?>
                                    · <?= htmlspecialchars($mascota['raza']) ?>
                                </p>
                                <p class="caracteristicas-mascota">
                                    <?= htmlspecialchars($mascota['edad']) ?> ·
                                    <?= htmlspecialchars($mascota['tamano']) ?> ·
                                    <?= htmlspecialchars($mascota['ubicacion']) ?>
                                </p>
                                <a href="detalles/detalle.php?id=<?= $mascota['id_mascota'] ?>" class="boton-detalle">
                                    Conocer más ♡
                                </a>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>

                <?php if (count($mascotasFiltradas) === 0): ?>
                    <p class="mensaje-sin-resultados" style="display:block;">
                        No encontramos mascotas con esos filtros.
                        Intenta seleccionar otras características. ♡
                    </p>
                <?php endif; ?>

                <p class="aviso-prototipo">
                    Proyecto académico con mascotas e historias ficticias.
                    Las fotografías son ilustrativas y no representan anuncios reales de adopción.
                </p>
            </div>
        </section>
    </main>

    <footer class="pie-pagina" id="contacto">
        <p>PetMatch CR — Plataforma de adopción responsable</p>
        <p>Un hogar cambia una vida. ♡</p>
    </footer>
</body>
</html>