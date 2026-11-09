
const CLAVE_SOLICITUDES = "petmatch_solicitudes";

// Mascotas de ejemplo
const mascotas = {
    luna: { nombre: "Luna", imagen: "../img/mascotas/luna/luna-1.jpg" },
    max: { nombre: "Max", imagen: "../img/mascotas/max/max-1.jpg" },
    canela: { nombre: "Canela", imagen: "../img/mascotas/canela/canela-1.jpg" },
    milo: { nombre: "Milo", imagen: "../img/mascotas/milo/milo-1.jpg" },
    nala: { nombre: "Nala", imagen: "../img/mascotas/nala/nala-1.jpg" },
    toby: { nombre: "Toby", imagen: "../img/mascotas/toby/toby-1.jpg" }
};

const solicitudesIniciales = [
    {
        id: 1,
        mascota: "luna",
        nombre: "Carlos Ramirez",
        correo: "carlos@ejemplo.com",
        telefono: "8888-1234",
        vivienda: "Casa propia",
        experiencia: "He tenido perros anteriormente.",
        motivo: "Quiero darle un hogar lleno de amor.",
        fecha: "2026-11-01",
        estado: "Pendiente"
    },
    {
        id: 2,
        mascota: "max",
        nombre: "Maria Fernandez",
        correo: "maria@ejemplo.com",
        telefono: "8777-4321",
        vivienda: "Apartamento",
        experiencia: "Tengo experiencia con mascotas.",
        motivo: "Busco un compañero para mi familia.",
        fecha: "2026-11-03",
        estado: "En revisión"
    },
    {
        id: 3,
        mascota: "canela",
        nombre: "Carlos Ramirez",
        correo: "carlos@ejemplo.com",
        telefono: "8888-1234",
        vivienda: "Casa propia",
        experiencia: "He tenido perros anteriormente.",
        motivo: "Quiero adoptar responsablemente.",
        fecha: "2026-11-04",
        estado: "Aprobada"
    }
];

// Solicitudes
function obtenerSolicitudes() {
    const guardadas = localStorage.getItem(CLAVE_SOLICITUDES);

    if (guardadas === null) {
        localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudesIniciales));
        return solicitudesIniciales;
    }

    try {
        const datos = JSON.parse(guardadas);
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes));
}

function claseEstado(estado) {
    const clases = {
        "Pendiente": "estado-pendiente",
        "En revisión": "estado-revision",
        "Aprobada": "estado-aprobada",
        "Rechazada": "estado-rechazada"
    };

    return clases[estado] || "estado-pendiente";
}

function crearElemento(etiqueta, texto, clase = "") {
    const elemento = document.createElement(etiqueta);
    elemento.textContent = texto;

    if (clase) elemento.className = clase;

    return elemento;
}

// Tarjetas de solicitudes
function crearTarjeta(solicitud, tipo) {
    const mascota = mascotas[solicitud.mascota];
    const tarjeta = crearElemento("article", "", "adopciones-item");

    const imagen = document.createElement("img");
    imagen.src = mascota.imagen;
    imagen.alt = mascota.nombre;

    const info = crearElemento("div", "", "adopciones-info");

    info.appendChild(crearElemento("h3", mascota.nombre));

    info.appendChild(crearElemento(
        "p", "Solicitante: " + solicitud.nombre
    ));

    info.appendChild(crearElemento(
        "p", "Fecha: " + solicitud.fecha
    ));

    info.appendChild(crearElemento(
        "span",
        solicitud.estado,
        "adopciones-estado " + claseEstado(solicitud.estado)
    ));

    const acciones = crearElemento("div", "", "adopciones-acciones");
    const enlace = crearElemento(
        "a", "Ver detalle", "adopciones-boton"
    );

    const vista = tipo === "recibidas" ? "rescatista" : "adoptante";

    enlace.href = "detalle-solicitud.html?id=" + solicitud.id + "&vista=" + vista;

    acciones.appendChild(enlace);
    info.appendChild(acciones);

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(info);

    return tarjeta;
}

// Listados
function mostrarListado(tipo) {
    const contenedor = document.getElementById("lista-solicitudes");

    if (!contenedor) return;

    const solicitudes = obtenerSolicitudes();
    contenedor.replaceChildren();

    let filtradas = solicitudes;

    if (tipo === "enviadas") {
        const correo = document.getElementById("correo-busqueda").value.trim().toLowerCase();

        if (correo === "") {
            contenedor.appendChild(crearElemento(
                "p",
                "Escribe el correo que utilizaste al enviar la solicitud.",
                "adopciones-vacio"
            ));
            return;
        }

        filtradas = solicitudes.filter(s => s.correo.toLowerCase() === correo);
    }

    if (filtradas.length === 0) {
        contenedor.appendChild(crearElemento(
            "p",
            "No hay solicitudes para mostrar con ese correo.",
            "adopciones-vacio"
        ));
        return;
    }

    filtradas.forEach(solicitud => {
        contenedor.appendChild(crearTarjeta(solicitud, tipo));
    });
}

// Formulario de adopción
function registrarSolicitud(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const datos = new FormData(formulario);
    const solicitudes = obtenerSolicitudes();

    const nueva = {
        id: Date.now(),
        mascota: datos.get("mascota"),
        nombre: datos.get("nombre").trim(),
        correo: datos.get("correo").trim().toLowerCase(),
        telefono: datos.get("telefono").trim(),
        vivienda: datos.get("vivienda"),
        experiencia: datos.get("experiencia").trim(),
        motivo: datos.get("motivo").trim(),
        fecha: new Date().toISOString().slice(0, 10),
        estado: "Pendiente"
    };

    solicitudes.push(nueva);
    guardarSolicitudes(solicitudes);

    alert("¡Solicitud enviada correctamente!");

    window.location.href = "detalle-solicitud.html?id=" + nueva.id + "&vista=adoptante";
}

// Detalle y estados
function mostrarDetalle() {
    const contenedor = document.getElementById("detalle-solicitud");

    if (!contenedor) return;

    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));
    const esRescatista = parametros.get("vista") === "rescatista";

    const enlaceVolver = document.getElementById("volver-solicitudes");
    const mensaje = document.getElementById("mensaje-detalle");
    const enlaceAdoptante = document.getElementById("enlace-adoptante");
    const enlaceRescatista = document.getElementById("enlace-rescatista");

    if (esRescatista) {
        enlaceVolver.href = "solicitudes-recibidas.html";
        enlaceRescatista.className = "activo";

        mensaje.textContent =
            "Vista de demostración del rescatista: puedes actualizar el estado de la solicitud.";
    } else {
        enlaceVolver.href = "mis-solicitudes.html";
        enlaceAdoptante.className = "activo";

        mensaje.textContent =
            "Vista de demostración del adoptante: puedes consultar el estado de la solicitud.";
    }

    const solicitud = obtenerSolicitudes().find(s => s.id === id);

    if (!solicitud) {
        contenedor.textContent = "Solicitud no encontrada.";
        return;
    }

    const mascota = mascotas[solicitud.mascota];

    contenedor.replaceChildren();

    contenedor.appendChild(crearElemento(
        "h2", "Solicitud #" + solicitud.id
    ));

    const campos = [
        ["Mascota", mascota.nombre],
        ["Solicitante", solicitud.nombre],
        ["Correo", solicitud.correo],
        ["Teléfono", solicitud.telefono],
        ["Tipo de vivienda", solicitud.vivienda],
        ["Experiencia", solicitud.experiencia],
        ["Motivo de adopción", solicitud.motivo],
        ["Fecha", solicitud.fecha]
    ];

    campos.forEach(([titulo, valor]) => {
        const parrafo = document.createElement("p");
        const etiqueta = document.createElement("strong");

        etiqueta.textContent = titulo + ": ";

        parrafo.append(
            etiqueta,
            document.createTextNode(valor)
        );

        contenedor.appendChild(parrafo);
    });

    contenedor.appendChild(crearElemento(
        "span",
        solicitud.estado,
        "adopciones-estado " + claseEstado(solicitud.estado)
    ));

    if (esRescatista) {
        const acciones = crearElemento(
            "div", "", "adopciones-acciones"
        );

        const estados = [
            ["En revisión", "secundario"],
            ["Aprobada", ""],
            ["Rechazada", "peligro"]
        ];

        estados.forEach(([nuevoEstado, estilo]) => {
            const boton = crearElemento(
                "button",
                nuevoEstado,
                "adopciones-boton " + estilo
            );

            boton.type = "button";
            boton.disabled = solicitud.estado === nuevoEstado;

            boton.addEventListener("click", () => {
                cambiarEstado(solicitud.id, nuevoEstado);
            });

            acciones.appendChild(boton);
        });

        contenedor.appendChild(acciones);
    }
}

function cambiarEstado(id, nuevoEstado) {
    const solicitudes = obtenerSolicitudes();
    const solicitud = solicitudes.find(s => s.id === id);

    if (!solicitud) return;

    solicitud.estado = nuevoEstado;

    guardarSolicitudes(solicitudes);
    mostrarDetalle();
}

// Inicio de cada pantalla
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-adopcion");

    if (formulario) {
        formulario.addEventListener("submit", registrarSolicitud);

        const parametros = new URLSearchParams(window.location.search);
        const mascota = parametros.get("mascota");

        if (mascota && mascotas[mascota]) {
            formulario.elements["mascota"].value = mascota;
        }
    }

    const formularioBusqueda = document.getElementById("formulario-busqueda");

    if (formularioBusqueda) {
        formularioBusqueda.addEventListener("submit", (evento) => {
            evento.preventDefault();
            mostrarListado("enviadas");
        });
    }

    const pagina = document.body.dataset.pagina;

    if (pagina === "enviadas") mostrarListado("enviadas");
    if (pagina === "recibidas") mostrarListado("recibidas");
    if (pagina === "detalle") mostrarDetalle();
});
