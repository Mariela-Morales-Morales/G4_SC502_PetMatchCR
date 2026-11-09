const estadosUsuariosAdmin = ["Activo", "Suspendido"];
const estadosMascotasAdmin = ["Disponible", "En proceso"];
const estadosSolicitudesAdmin = ["Pendiente", "En revisión", "Aprobada", "Rechazada"];

const usuariosDemoAdmin = [
    { nombre: "Carlos Ramírez", correo: "carlos@ejemplo.com", telefono: "8888-1234", estado: "Activo" },
    { nombre: "María Fernández", correo: "maria@ejemplo.com", telefono: "8777-4321", estado: "Activo" }
];

let mascotasDemoAdmin = [
    { id: "milo", nombre: "Milo", especie: "Perro", responsable: "Rescatista de ejemplo", estado: "Disponible" },
    { id: "luna", nombre: "Luna", especie: "Gato", responsable: "Rescatista de ejemplo", estado: "Disponible" },
    { id: "canela", nombre: "Canela", especie: "Perro", responsable: "Rescatista de ejemplo", estado: "Disponible" },
    { id: "max", nombre: "Max", especie: "Perro", responsable: "Rescatista de ejemplo", estado: "Disponible" },
    { id: "nala", nombre: "Nala", especie: "Gato", responsable: "Rescatista de ejemplo", estado: "Disponible" },
    { id: "toby", nombre: "Toby", especie: "Perro", responsable: "Rescatista de ejemplo", estado: "Disponible" }
];

function crearElementoAdmin(etiqueta, contenido, clase) {
    const elemento = document.createElement(etiqueta);
    elemento.textContent = contenido;
    if (clase) elemento.className = clase;
    return elemento;
}

function claseEstadoAdmin(estado) {
    if (estado === "En revisión" || estado === "En proceso") return "estado-revision";
    if (estado === "Aprobada" || estado === "Disponible" || estado === "Activo") return "estado-aprobada";
    if (estado === "Rechazada" || estado === "Suspendido") return "estado-rechazada";
    return "estado-pendiente";
}

function mostrarMensajeAdmin(mensaje) {
    const aviso = document.getElementById("mensaje-admin");
    if (!aviso) return;
    aviso.hidden = false;
    aviso.textContent = mensaje;
}

function mostrarResumenAdmin() {
    const resumen = document.getElementById("resumen-admin");
    const estadisticas = document.getElementById("estadisticas-solicitudes");
    resumen.innerHTML = "";
    estadisticas.innerHTML = "";

    const totales = [
        { titulo: "Usuarios de ejemplo", cantidad: usuariosDemoAdmin.length, enlace: "usuarios.html" },
        { titulo: "Mascotas de ejemplo", cantidad: mascotasDemoAdmin.length, enlace: "mascotas.html" },
        { titulo: "Solicitudes de ejemplo", cantidad: solicitudesEjemplo.length, enlace: "solicitudes.html" }
    ];

    totales.forEach(function (total) {
        const tarjeta = crearElementoAdmin("a", "", "adopciones-tarjeta");
        tarjeta.href = total.enlace;
        tarjeta.appendChild(crearElementoAdmin("h2", total.titulo));
        tarjeta.appendChild(crearElementoAdmin("p", total.cantidad, "admin-total"));
        resumen.appendChild(tarjeta);
    });

    estadosSolicitudesAdmin.forEach(function (estado, indice) {
        const cantidad = solicitudesEjemplo.filter(function (solicitud) {
            return solicitud.estado === estado;
        }).length;
        const fila = document.createElement("div");
        const etiqueta = crearElementoAdmin("label", estado + " (" + cantidad + ")");
        const barra = document.createElement("progress");
        barra.id = "estadistica-" + indice;
        barra.max = solicitudesEjemplo.length || 1;
        barra.value = cantidad;
        etiqueta.htmlFor = barra.id;
        fila.appendChild(etiqueta);
        fila.appendChild(barra);
        estadisticas.appendChild(fila);
    });
}

function agregarFilaAdmin(campos, estado, acciones) {
    const fila = document.createElement("tr");
    campos.forEach(function (valor) {
        fila.appendChild(crearElementoAdmin("td", valor || "—"));
    });
    const celdaEstado = document.createElement("td");
    celdaEstado.appendChild(crearElementoAdmin("span", estado, "adopciones-estado " + claseEstadoAdmin(estado)));
    const celdaAcciones = document.createElement("td");
    celdaAcciones.appendChild(acciones);
    fila.appendChild(celdaEstado);
    fila.appendChild(celdaAcciones);
    document.getElementById("lista-admin").appendChild(fila);
}

function mostrarVacioAdmin(mensaje) {
    const fila = document.createElement("tr");
    const celda = crearElementoAdmin("td", mensaje, "admin-vacio");
    celda.colSpan = 5;
    fila.appendChild(celda);
    document.getElementById("lista-admin").appendChild(fila);
}

function selectorEstadoAdmin(estados, actual, nombre, actualizar) {
    const selector = document.createElement("select");
    selector.setAttribute("aria-label", "Cambiar estado de " + nombre);
    estados.forEach(function (estado) {
        const opcion = document.createElement("option");
        opcion.value = estado;
        opcion.textContent = estado;
        selector.appendChild(opcion);
    });
    selector.value = actual;
    selector.addEventListener("change", function () {
        actualizar(selector.value);
    });
    return selector;
}

function mostrarUsuariosAdmin() {
    if (usuariosDemoAdmin.length === 0) mostrarVacioAdmin("No hay usuarios de ejemplo.");
    usuariosDemoAdmin.forEach(function (usuario) {
        const selector = selectorEstadoAdmin(estadosUsuariosAdmin, usuario.estado, usuario.correo, function (nuevoEstado) {
            usuario.estado = nuevoEstado;
            mostrarAdmin();
            mostrarMensajeAdmin("Estado de ejemplo actualizado. No modifica cuentas reales.");
        });
        agregarFilaAdmin([usuario.nombre, usuario.correo, usuario.telefono], usuario.estado, selector);
    });
}

function mostrarMascotasAdmin() {
    if (mascotasDemoAdmin.length === 0) mostrarVacioAdmin("No hay mascotas de ejemplo.");
    mascotasDemoAdmin.forEach(function (mascota) {
        const acciones = crearElementoAdmin("div", "", "adopciones-acciones");
        const selector = selectorEstadoAdmin(estadosMascotasAdmin, mascota.estado, mascota.nombre, function (nuevoEstado) {
            mascota.estado = nuevoEstado;
            mostrarAdmin();
            mostrarMensajeAdmin("Estado de ejemplo actualizado en esta pantalla.");
        });
        const retirar = crearElementoAdmin("button", "Retirar", "adopciones-boton peligro");
        retirar.type = "button";
        retirar.addEventListener("click", function () {
            if (!confirm("¿Retirar a " + mascota.nombre + " de esta demostración?")) return;
            mascotasDemoAdmin = mascotasDemoAdmin.filter(function (registro) {
                return registro.id !== mascota.id;
            });
            mostrarAdmin();
            mostrarMensajeAdmin("Mascota retirada de esta demostración. El catálogo original no cambia.");
        });
        acciones.appendChild(selector);
        acciones.appendChild(retirar);
        agregarFilaAdmin([mascota.nombre, mascota.especie, mascota.responsable], mascota.estado, acciones);
    });
}

function mostrarSolicitudesAdmin() {
    if (solicitudesEjemplo.length === 0) mostrarVacioAdmin("No hay solicitudes de ejemplo.");
    solicitudesEjemplo.forEach(function (solicitud) {
        const acciones = crearElementoAdmin("div", "", "adopciones-acciones");
        const selector = selectorEstadoAdmin(estadosSolicitudesAdmin, solicitud.estado, "solicitud " + solicitud.id, function (nuevoEstado) {
            solicitud.estado = nuevoEstado;
            mostrarAdmin();
            mostrarMensajeAdmin("Estado de ejemplo actualizado en esta pantalla.");
        });
        const detalle = crearElementoAdmin("a", "Ver detalle", "adopciones-boton secundario");
        detalle.href = "../adopciones/detalle-solicitud.html#solicitud-" + solicitud.id;
        acciones.appendChild(selector);
        acciones.appendChild(detalle);
        const mascota = mascotasAdopcion[solicitud.mascota];
        const nombreMascota = mascota ? mascota.nombre : solicitud.mascota;
        agregarFilaAdmin([nombreMascota, solicitud.nombre, solicitud.fecha], solicitud.estado, acciones);
    });
}

function mostrarAdmin() {
    const pagina = document.body.getAttribute("data-admin");
    if (pagina === "resumen") {
        mostrarResumenAdmin();
        return;
    }
    const lista = document.getElementById("lista-admin");
    if (!lista) return;
    lista.innerHTML = "";
    if (pagina === "usuarios") mostrarUsuariosAdmin();
    if (pagina === "mascotas") mostrarMascotasAdmin();
    if (pagina === "solicitudes") mostrarSolicitudesAdmin();
}

document.addEventListener("DOMContentLoaded", mostrarAdmin);
