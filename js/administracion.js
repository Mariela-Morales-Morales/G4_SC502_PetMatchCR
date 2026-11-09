// Estados del panel
const estadosUsuarios = ["Activo", "Suspendido"];
const estadosMascotas = ["Disponible", "En proceso"];
const estadosSolicitudes = ["Pendiente", "En revisión", "Aprobada", "Rechazada"];

function mostrarResumenAdmin() {
    const resumen = document.getElementById("resumen-admin");
    const estadisticas = document.getElementById("estadisticas-solicitudes");
    const solicitudes = obtenerSolicitudes();
    const totales = [
        ["Usuarios registrados", leer("petmatch_usuarios", []).length, "usuarios.html"],
        ["Mascotas publicadas", leer("petmatch_mascotas", []).length, "mascotas.html"],
        ["Solicitudes de adopción", solicitudes.length, "solicitudes.html"]
    ];

    resumen.replaceChildren();
    estadisticas.replaceChildren();

    totales.forEach(([titulo, cantidad, destino]) => {
        const tarjeta = crearElemento("a", "", "adopciones-tarjeta");
        tarjeta.href = destino;
        tarjeta.append(
            crearElemento("h2", titulo),
            crearElemento("p", cantidad, "admin-total")
        );
        resumen.appendChild(tarjeta);
    });

    estadosSolicitudes.forEach((estado, indice) => {
        const cantidad = solicitudes.filter(solicitud => solicitud.estado === estado).length;
        const fila = document.createElement("div");
        const etiqueta = crearElemento("label", estado + " (" + cantidad + ")");
        const barra = document.createElement("progress");
        barra.id = "estadistica-" + indice;
        barra.max = solicitudes.length || 1;
        barra.value = cantidad;
        etiqueta.htmlFor = barra.id;

        fila.append(etiqueta, barra);
        estadisticas.appendChild(fila);
    });
}

function agregarFilaAdmin(campos, estado, clase, acciones) {
    const fila = document.createElement("tr");
    campos.forEach(valor => fila.appendChild(crearElemento("td", valor || "—")));

    const celdaEstado = document.createElement("td");
    celdaEstado.appendChild(crearElemento("span", estado, "adopciones-estado " + clase));

    const celdaAcciones = document.createElement("td");
    celdaAcciones.appendChild(acciones);
    fila.append(celdaEstado, celdaAcciones);
    document.getElementById("lista-admin").appendChild(fila);
}

function selectorEstadoAdmin(estados, actual, nombre, actualizar) {
    const selector = document.createElement("select");
    selector.setAttribute("aria-label", "Cambiar estado de " + nombre);

    estados.forEach(estado => selector.add(new Option(estado, estado)));
    selector.value = actual;
    selector.addEventListener("change", () => actualizar(selector.value));

    return selector;
}

function mostrarMensajeAdmin(mensaje) {
    const aviso = document.getElementById("mensaje-admin");
    aviso.hidden = false;
    aviso.textContent = mensaje;
}

function mostrarVacioAdmin(mensaje) {
    const fila = document.createElement("tr");
    const celda = crearElemento("td", mensaje, "admin-vacio");
    celda.colSpan = 5;
    fila.appendChild(celda);
    document.getElementById("lista-admin").appendChild(fila);
}

// Usuarios registrados
function mostrarUsuariosAdmin() {
    const usuarios = leer("petmatch_usuarios", []);
    if (!usuarios.length) mostrarVacioAdmin("Aún no hay usuarios registrados.");

    usuarios.forEach(usuario => {
        const estado = usuario.estado || "Activo";
        const selector = selectorEstadoAdmin(estadosUsuarios, estado, usuario.correo, nuevoEstado => {
            const registrados = leer("petmatch_usuarios", []);
            const registro = registrados.find(u => u.correo === usuario.correo);

            if (!registro) return mostrarAdmin();

            registro.estado = nuevoEstado;
            guardar("petmatch_usuarios", registrados);
            const sesion = leer("petmatch_usuario", null);
            if (nuevoEstado === "Suspendido" && sesion?.correo === usuario.correo) {
                localStorage.removeItem("petmatch_usuario");
            }

            mostrarAdmin();
            mostrarMensajeAdmin("Estado del usuario actualizado.");
        });

        const clase = estado === "Suspendido" ? "estado-rechazada" : "estado-aprobada";
        agregarFilaAdmin([usuario.nombre, usuario.correo, usuario.telefono], estado, clase, selector);
    });
}

// Publicaciones registradas
function mostrarMascotasAdmin() {
    const publicaciones = leer("petmatch_mascotas", []);
    if (!publicaciones.length) mostrarVacioAdmin("Aún no hay mascotas publicadas desde el formulario.");

    publicaciones.forEach(mascota => {
        const estado = mascota.estado || "Disponible";
        const acciones = crearElemento("div", "", "adopciones-acciones");
        const selector = selectorEstadoAdmin(estadosMascotas, estado, mascota.nombre, nuevoEstado => {
            const registros = leer("petmatch_mascotas", []);
            const registro = registros.find(m => m.id === mascota.id);

            if (!registro) return mostrarAdmin();

            registro.estado = nuevoEstado;
            guardar("petmatch_mascotas", registros);
            mostrarAdmin();
            mostrarMensajeAdmin("Estado de la publicación actualizado.");
        });

        const retirar = crearElemento("button", "Retirar", "adopciones-boton peligro");
        retirar.type = "button";
        retirar.setAttribute("aria-label", "Retirar publicación de " + mascota.nombre);
        retirar.addEventListener("click", () => {
            if (!confirm("¿Deseas retirar la publicación de " + mascota.nombre + "?")) return;

            const registros = leer("petmatch_mascotas", []);
            guardar("petmatch_mascotas", registros.filter(m => m.id !== mascota.id));
            mostrarAdmin();
            mostrarMensajeAdmin("Publicación retirada.");
        });

        acciones.append(selector, retirar);
        const clase = estado === "En proceso" ? "estado-revision" : "estado-aprobada";
        agregarFilaAdmin([mascota.nombre, mascota.especie, mascota.propietario], estado, clase, acciones);
    });
}

// Solicitudes de adopción
function mostrarSolicitudesAdmin() {
    const solicitudes = obtenerSolicitudes();
    if (!solicitudes.length) mostrarVacioAdmin("Aún no hay solicitudes de adopción.");

    solicitudes.forEach(solicitud => {
        const nombreMascota = mascotas[solicitud.mascota]?.nombre || solicitud.mascota;
        const acciones = crearElemento("div", "", "adopciones-acciones");
        const selector = selectorEstadoAdmin(estadosSolicitudes, solicitud.estado, "solicitud " + solicitud.id, estado => {
            cambiarEstado(solicitud.id, estado);
            mostrarAdmin();
            mostrarMensajeAdmin("Estado de la solicitud actualizado.");
        });

        const detalle = crearElemento("a", "Ver detalle", "adopciones-boton secundario");
        detalle.href = "../adopciones/detalle-solicitud.html?id=" + encodeURIComponent(solicitud.id) + "&vista=adoptante";

        acciones.append(selector, detalle);
        agregarFilaAdmin(
            [nombreMascota, solicitud.nombre, solicitud.fecha],
            solicitud.estado,
            claseEstado(solicitud.estado),
            acciones
        );
    });
}

function mostrarAdmin() {
    const pagina = document.body.dataset.admin;
    if (pagina === "resumen") return mostrarResumenAdmin();

    document.getElementById("lista-admin").replaceChildren();
    if (pagina === "usuarios") mostrarUsuariosAdmin();
    if (pagina === "mascotas") mostrarMascotasAdmin();
    if (pagina === "solicitudes") mostrarSolicitudesAdmin();
}

document.addEventListener("DOMContentLoaded", mostrarAdmin);
window.addEventListener("storage", evento => {
    if (["petmatch_usuarios", "petmatch_mascotas", CLAVE_SOLICITUDES].includes(evento.key)) {
        mostrarAdmin();
    }
});
