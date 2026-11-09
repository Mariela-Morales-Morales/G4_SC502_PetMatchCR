/* PetMatch CR - Persona 2. Demostraciones de frontend (semanas 6 y 7). */
/* Los formularios no almacenan cuentas ni publicaciones entre páginas. */
function mensajeUsuario(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = texto;
        elemento.style.display = "block";
    }
}

// Validación del registro: no se guarda ninguna contraseña.
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const clave = document.getElementById("contrasena").value;
        const confirmar = document.getElementById("confirmar").value;
        if (clave !== confirmar) {
            mensajeUsuario("mensajeRegistro", "Las contraseñas no coinciden.");
        } else {
            mensajeUsuario("mensajeRegistro", "Formulario de " + nombre + " validado correctamente. Demostración: la cuenta no se guarda todavía.");
        }
    });
}

// Acceso de prueba, exclusivamente con datos ficticios.
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const correo = document.getElementById("correoLogin").value.toLowerCase();
        const clave = document.getElementById("claveLogin").value;
        if (correo === "demo@petmatch.cr" && clave === "Demo123") {
            mensajeUsuario("mensajeLogin", "Acceso de demostración correcto. Abre «Mi perfil» en el menú superior. No se ha creado una sesión real.");
        } else {
            mensajeUsuario("mensajeLogin", "Datos de demostración incorrectos. Utiliza demo@petmatch.cr y Demo123.");
        }
    });
}

// Perfil de muestra: edición visible solo en esta página.
const formPerfil = document.getElementById("formPerfil");
if (formPerfil) {
    const nombre = document.getElementById("perfilNombre");
    const telefono = document.getElementById("perfilTelefono");
    const correo = document.getElementById("perfilCorreo");
    nombre.value = "Usuario de demostración";
    telefono.value = "8888-0000";
    correo.value = "demo@petmatch.cr";
    document.getElementById("nombrePerfil").textContent = nombre.value;
    document.getElementById("correoPerfil").textContent = correo.value;
    document.getElementById("inicialPerfil").textContent = "U";
    formPerfil.addEventListener("submit", function (evento) {
        evento.preventDefault();
        document.getElementById("nombrePerfil").textContent = nombre.value;
        document.getElementById("correoPerfil").textContent = correo.value;
        document.getElementById("inicialPerfil").textContent = "U";
        mensajeUsuario("mensajePerfil", "Datos actualizados en la vista de demostración. Al abrir de nuevo esta página se restablecerán.");
    });
}

// Registro y edición temporal de mascotas (solo mientras esta página permanezca abierta).
// Se usan arreglos, objetos, eventos y manipulación del DOM de las semanas 6 y 7.
const formMascota = document.getElementById("formMascota");
if (formMascota) {
    let mascotasTemporales = [];
    let mascotaEnEdicion = -1;
    const contenedor = document.getElementById("vista-publicacion");
    const botonPublicar = formMascota.querySelector('button[type="submit"]');

    function mostrarMascotasTemporales() {
        contenedor.innerHTML = "";

        const titulo = document.createElement("h2");
        titulo.textContent = "Mis mascotas registradas en esta página";
        titulo.style.margin = "24px 0 15px";
        titulo.style.color = "#2F5D50";
        contenedor.append(titulo);

        if (mascotasTemporales.length === 0) {
            const aviso = document.createElement("p");
            aviso.textContent = "Todavía no has registrado mascotas en esta demostración.";
            contenedor.append(aviso);
        }

        const cuadricula = document.createElement("div");
        cuadricula.className = "cuadricula-publicaciones";

        mascotasTemporales.forEach(function (mascota, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-publicacion";

            const informacion = document.createElement("div");
            informacion.className = "info-publicacion";

            const nombre = document.createElement("h3");
            nombre.textContent = mascota.nombre;
            informacion.append(nombre);

            const caracteristicas = [
                "Especie: " + mascota.especie,
                "Raza: " + mascota.raza,
                "Edad: " + mascota.edad,
                "Sexo: " + mascota.sexo,
                "Tamaño: " + mascota.tamano,
                "Provincia: " + mascota.ubicacion,
                "Vacunas: " + mascota.vacunas,
                "Esterilización: " + mascota.esterilizada,
                "Descripción: " + mascota.descripcion
            ];

            caracteristicas.forEach(function (detalle) {
                const texto = document.createElement("p");
                texto.textContent = detalle;
                informacion.append(texto);
            });

            const estado = document.createElement("span");
            estado.className = "estado-publicacion";
            estado.textContent = mascota.estado;
            informacion.append(estado);

            const acciones = document.createElement("div");
            acciones.className = "botones-publicacion";

            const editar = document.createElement("button");
            editar.type = "button";
            editar.className = "boton-borde";
            editar.textContent = "Editar";
            editar.addEventListener("click", function () {
                mascotaEnEdicion = indice;
                document.getElementById("mascotaNombre").value = mascota.nombre;
                document.getElementById("especieMascota").value = mascota.especie;
                document.getElementById("razaMascota").value = mascota.raza;
                document.getElementById("edadMascota").value = mascota.edad;
                document.getElementById("sexoMascota").value = mascota.sexo;
                document.getElementById("tamanoMascota").value = mascota.tamano;
                document.getElementById("ubicacionMascota").value = mascota.ubicacion;
                document.getElementById("estadoMascota").value = mascota.estado;
                document.getElementById("vacunasMascota").value = mascota.vacunas;
                document.getElementById("esterilizadaMascota").value = mascota.esterilizada;
                document.getElementById("descripcionMascota").value = mascota.descripcion;
                botonPublicar.textContent = "Guardar cambios";
                mensajeUsuario("mensajeMascota", "Modifica los datos del formulario y presiona Guardar cambios.");
            });

            const retirar = document.createElement("button");
            retirar.type = "button";
            retirar.className = "boton-cafe";
            retirar.textContent = "Retirar";
            retirar.addEventListener("click", function () {
                if (!confirm("¿Retirar a " + mascota.nombre + " de la demostración?")) return;
                mascotasTemporales = mascotasTemporales.filter(function (registro, posicion) {
                    return posicion !== indice;
                });
                mascotaEnEdicion = -1;
                formMascota.reset();
                botonPublicar.textContent = "Publicar mascota";
                mostrarMascotasTemporales();
                mensajeUsuario("mensajeMascota", "Mascota retirada de la lista temporal.");
            });

            acciones.append(editar, retirar);
            informacion.append(acciones);
            tarjeta.append(informacion);
            cuadricula.append(tarjeta);
        });
        contenedor.append(cuadricula);
    }

    formMascota.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const mascota = {
            nombre: document.getElementById("mascotaNombre").value.trim(),
            especie: document.getElementById("especieMascota").value,
            raza: document.getElementById("razaMascota").value.trim(),
            edad: document.getElementById("edadMascota").value.trim(),
            sexo: document.getElementById("sexoMascota").value,
            tamano: document.getElementById("tamanoMascota").value,
            ubicacion: document.getElementById("ubicacionMascota").value,
            estado: document.getElementById("estadoMascota").value,
            vacunas: document.getElementById("vacunasMascota").value,
            esterilizada: document.getElementById("esterilizadaMascota").value,
            descripcion: document.getElementById("descripcionMascota").value.trim()
        };

        if (mascotaEnEdicion >= 0) {
            mascotasTemporales[mascotaEnEdicion] = mascota;
            mensajeUsuario("mensajeMascota", "Cambios aplicados a la mascota de demostración.");
        } else {
            mascotasTemporales.push(mascota);
            mensajeUsuario("mensajeMascota", "Mascota agregada a la lista temporal de esta página.");
        }

        mascotaEnEdicion = -1;
        formMascota.reset();
        botonPublicar.textContent = "Publicar mascota";
        mostrarMascotasTemporales();
    });

    // Mantener la lista temporal visible: al limpiar no abandonamos esta página.
    const enlaceCancelar = formMascota.querySelector(".acciones-formulario a.boton-borde");
    if (enlaceCancelar) {
        enlaceCancelar.textContent = "Limpiar formulario";
        enlaceCancelar.addEventListener("click", function (evento) {
            evento.preventDefault();
            formMascota.reset();
            mascotaEnEdicion = -1;
            botonPublicar.textContent = "Publicar mascota";
            mensajeUsuario("mensajeMascota", "Formulario limpio. Las mascotas de esta demostración siguen en la lista de abajo.");
        });
    }
    mostrarMascotasTemporales();
}

// Mis publicaciones: muestra registros ficticios y permite editarlos o retirarlos temporalmente.
const listaPublicaciones = document.getElementById("listaPublicaciones");
if (listaPublicaciones) {
    let publicacionesEjemplo = [
        { nombre: "Sol", especie: "Perro", ubicacion: "Alajuela", estado: "Disponible" },
        { nombre: "Chispa", especie: "Gato", ubicacion: "Heredia", estado: "En proceso" }
    ];
    function mostrarPublicaciones() {
        listaPublicaciones.innerHTML = "";
        const mensaje = document.getElementById("mensajePublicaciones");
        mensaje.style.display = publicacionesEjemplo.length === 0 ? "block" : "none";
        publicacionesEjemplo.forEach(function (mascota, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-publicacion";
            const imagen = document.createElement("div");
            imagen.className = "imagen-publicacion";
            imagen.textContent = "♡";
            const info = document.createElement("div");
            info.className = "info-publicacion";
            const titulo = document.createElement("h3");
            titulo.textContent = mascota.nombre;
            const datos = document.createElement("p");
            datos.textContent = mascota.especie + " · " + mascota.ubicacion;
            const estado = document.createElement("span");
            estado.className = "estado-publicacion";
            estado.textContent = mascota.estado;
            const controles = document.createElement("div");
            controles.className = "botones-publicacion";
            const editar = document.createElement("button");
            editar.className = "boton-borde";
            editar.type = "button";
            editar.textContent = "Editar nombre";
            editar.addEventListener("click", function () {
                const formulario = document.createElement("form");
                const campo = document.createElement("input");
                campo.type = "text";
                campo.value = mascota.nombre;
                campo.required = true;
                campo.style.width = "100%";
                campo.style.padding = "10px";
                campo.style.margin = "10px 0";
                const guardar = document.createElement("button");
                guardar.className = "boton-verde";
                guardar.type = "submit";
                guardar.textContent = "Guardar nombre";
                formulario.append(campo, guardar);
                formulario.addEventListener("submit", function (evento) {
                    evento.preventDefault();
                    mascota.nombre = campo.value;
                    mostrarPublicaciones();
                });
                controles.innerHTML = "";
                controles.append(formulario);
            });
            const retirar = document.createElement("button");
            retirar.className = "boton-cafe";
            retirar.type = "button";
            retirar.textContent = "Retirar";
            retirar.addEventListener("click", function () {
                if (confirm("¿Retirar esta publicación ficticia de la vista actual?")) {
                    publicacionesEjemplo = publicacionesEjemplo.filter(function (publicacion, posicion) {
                        return posicion !== indice;
                    });
                    mostrarPublicaciones();
                }
            });
            controles.append(editar, retirar);
            info.append(titulo, datos, estado, controles);
            tarjeta.append(imagen, info);
            listaPublicaciones.append(tarjeta);
        });
    }
    mostrarPublicaciones();
}
