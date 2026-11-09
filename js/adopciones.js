/* PetMatch CR - Persona 3: solicitudes de demostración.
   Utiliza formularios, arreglos, objetos, eventos y DOM de semanas 6 y 7.
   Las solicitudes nuevas permanecen en la pantalla abierta;
   para conservarlas ENTRE páginas será necesario implementar PHP (semana 8).
*/
const mascotasAdopcion = {
    luna: { nombre: "Luna", imagen: "../img/mascotas/luna/luna-1.jpg" },
    max: { nombre: "Max", imagen: "../img/mascotas/max/max-1.jpg" },
    canela: { nombre: "Canela", imagen: "../img/mascotas/canela/canela-1.jpg" },
    milo: { nombre: "Milo", imagen: "../img/mascotas/milo/milo-1.jpg" },
    nala: { nombre: "Nala", imagen: "../img/mascotas/nala/nala-1.jpg" },
    toby: { nombre: "Toby", imagen: "../img/mascotas/toby/toby-1.jpg" }
};
const solicitudesEjemplo = [
    { id: 1, mascota: "luna", nombre: "Carlos Ramírez", correo: "carlos@ejemplo.com", fecha: "2026-11-01", estado: "Pendiente" },
    { id: 2, mascota: "max", nombre: "María Fernández", correo: "maria@ejemplo.com", fecha: "2026-11-03", estado: "En revisión" },
    { id: 3, mascota: "canela", nombre: "Carlos Ramírez", correo: "carlos@ejemplo.com", fecha: "2026-11-04", estado: "Aprobada" }
];

function claseEstadoAdopcion(estado) {
    if (estado === "En revisión") return "estado-revision";
    if (estado === "Aprobada") return "estado-aprobada";
    if (estado === "Rechazada") return "estado-rechazada";
    return "estado-pendiente";
}

function crearTextoAdopcion(tipo, contenido, clase) {
    const elemento = document.createElement(tipo);
    elemento.textContent = contenido;
    if (clase) elemento.className = clase;
    return elemento;
}

// Lista de solicitudes de ejemplo para las páginas del módulo.
function mostrarListaAdopcion(solicitudes) {
    const contenedor = document.getElementById("lista-solicitudes");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    if (solicitudes.length === 0) {
        contenedor.append(crearTextoAdopcion("p", "No hay solicitudes de ejemplo con ese correo.", "adopciones-vacio"));
    }
    solicitudes.forEach(function (solicitud) {
        const mascota = mascotasAdopcion[solicitud.mascota];
        const tarjeta = document.createElement("article");
        tarjeta.className = "adopciones-item";
        const imagen = document.createElement("img");
        imagen.src = mascota.imagen;
        imagen.alt = mascota.nombre;
        const info = document.createElement("div");
        info.className = "adopciones-info";
        info.append(crearTextoAdopcion("h3", mascota.nombre));
        info.append(crearTextoAdopcion("p", "Solicitante: " + solicitud.nombre));
        info.append(crearTextoAdopcion("p", "Fecha: " + solicitud.fecha));
        info.append(crearTextoAdopcion("span", solicitud.estado, "adopciones-estado " + claseEstadoAdopcion(solicitud.estado)));
        const acciones = document.createElement("div");
        acciones.className = "adopciones-acciones";
        const enlace = crearTextoAdopcion("a", "Ver detalle", "adopciones-boton");
        enlace.href = "detalle-solicitud.html#solicitud-" + solicitud.id;
        acciones.append(enlace);
        info.append(acciones);
        tarjeta.append(imagen, info);
        contenedor.append(tarjeta);
    });
}

// Solicitudes enviadas durante esta visita a la pantalla.
// Cada envío se añade a la lista visible sin borrar el anterior.
const formularioAdopcion = document.getElementById("formulario-adopcion");
if (formularioAdopcion) {
    let solicitudesTemporales = [];
    const resultado = document.getElementById("resultado-solicitud");

    function mostrarSolicitudesTemporales() {
        resultado.innerHTML = "";
        resultado.append(crearTextoAdopcion("h2", "Solicitudes enviadas en esta demostración ♡"));
        resultado.append(crearTextoAdopcion("p", "Los datos se mantienen solamente mientras permanezcas en esta página. Utiliza datos ficticios."));
        solicitudesTemporales.forEach(function (solicitud, indice) {
            const mascota = mascotasAdopcion[solicitud.mascota];
            const ficha = document.createElement("article");
            ficha.className = "adopciones-item";
            const informacion = document.createElement("div");
            informacion.className = "adopciones-info";
            informacion.append(crearTextoAdopcion("h3", "Solicitud " + (indice + 1) + " — " + mascota.nombre));
            const campos = [
                "Nombre: " + solicitud.nombre,
                "Correo: " + solicitud.correo,
                "Teléfono: " + solicitud.telefono,
                "Vivienda: " + solicitud.vivienda,
                "Experiencia: " + solicitud.experiencia,
                "Motivo: " + solicitud.motivo
            ];
            campos.forEach(function (dato) {
                informacion.append(crearTextoAdopcion("p", dato));
            });
            informacion.append(crearTextoAdopcion("span", "Pendiente (demostración)", "adopciones-estado estado-pendiente"));
            ficha.append(informacion);
            resultado.append(ficha);
        });
        resultado.style.display = "block";
    }

    formularioAdopcion.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const datos = Object.fromEntries(new FormData(formularioAdopcion));
        if (!mascotasAdopcion[datos.mascota]) return;
        solicitudesTemporales.push(datos);
        mostrarSolicitudesTemporales();
        formularioAdopcion.reset();
    });
}

// Mis solicitudes: búsqueda por correo en los ejemplos de la página.
const formularioBusqueda = document.getElementById("formulario-busqueda");
if (formularioBusqueda) {
    formularioBusqueda.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const correo = document.getElementById("correo-busqueda").value.trim().toLowerCase();
        const filtradas = solicitudesEjemplo.filter(function (solicitud) {
            return solicitud.correo.toLowerCase() === correo;
        });
        mostrarListaAdopcion(filtradas);
    });
    document.getElementById("lista-solicitudes").append(
        crearTextoAdopcion("p", "Escribe un correo ficticio para consultar solicitudes de demostración.", "adopciones-vacio")
    );
}
// Panel rescatista: muestra únicamente solicitudes de ejemplo, sin permisos reales.
if (document.getElementById("lista-solicitudes") && !formularioBusqueda) {
    mostrarListaAdopcion(solicitudesEjemplo);
}

// Panel de detalle: botones para cambiar el estado visible en esta página.
const accionesDetalle = document.querySelectorAll("#detalle-solicitud .adopciones-acciones");
accionesDetalle.forEach(function (acciones, indice) {
    const id = indice + 1;
    const botones = acciones.querySelectorAll("button");
    botones.forEach(function (boton) {
        boton.addEventListener("click", function () {
            const estado = document.getElementById("estado-" + id);
            if (estado) {
                estado.textContent = boton.textContent;
                estado.className = "adopciones-estado " + claseEstadoAdopcion(boton.textContent);
            }
        });
    });
});
