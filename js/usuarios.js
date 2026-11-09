
const leer = (clave, defecto) => {
    try { return JSON.parse(localStorage.getItem(clave)) ?? defecto; }
    catch { return defecto; }
};
const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));
const mostrar = (id, texto) => {
    const elemento = document.getElementById(id);
    if (elemento) { elemento.textContent = texto; elemento.style.display = "block"; }
};
const usuarioActual = () => {
    const sesion = leer("petmatch_usuario", null);
    if (!sesion) return null;
    const usuario = leer("petmatch_usuarios", []).find(u => u.correo === sesion.correo);
    return usuario && usuario.estado !== "Suspendido" ? usuario : null;
};

// Registro de usuarios
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const clave = document.getElementById("contrasena").value;
        const confirmar = document.getElementById("confirmar").value;
        if (clave !== confirmar) return mostrar("mensajeRegistro", "Las contraseñas no coinciden.");
        const usuarios = leer("petmatch_usuarios", []);
        if (usuarios.some(u => u.correo === correo)) return mostrar("mensajeRegistro", "Ya existe una cuenta con ese correo.");
        const usuario = { nombre, telefono, correo, clave };
        usuarios.push(usuario); guardar("petmatch_usuarios", usuarios);
        guardar("petmatch_usuario", usuario);
        mostrar("mensajeRegistro", "¡Cuenta creada correctamente! Ya puedes ingresar a tu perfil.");
        setTimeout(() => location.href = "perfil.html", 900);
    });
}

// Inicio de sesión
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
        const clave = document.getElementById("claveLogin").value;
        const usuario = leer("petmatch_usuarios", []).find(u => u.correo === correo && u.clave === clave);
        if (!usuario) return mostrar("mensajeLogin", "Correo o contraseña incorrectos. Verifica tus datos.");
        if (usuario.estado === "Suspendido") return mostrar("mensajeLogin", "Esta cuenta está suspendida.");
        guardar("petmatch_usuario", usuario);
        mostrar("mensajeLogin", "Inicio de sesión correcto. ¡Bienvenido!");
        setTimeout(() => location.href = "perfil.html", 700);
    });
}

// Perfil
const formPerfil = document.getElementById("formPerfil");
if (formPerfil) {
    const usuario = usuarioActual();
    if (usuario) {
        document.getElementById("perfilNombre").value = usuario.nombre || "";
        document.getElementById("perfilTelefono").value = usuario.telefono || "";
        document.getElementById("perfilCorreo").value = usuario.correo || "";
        document.getElementById("nombrePerfil").textContent = usuario.nombre || "Usuario";
        document.getElementById("correoPerfil").textContent = usuario.correo || "";
        document.getElementById("inicialPerfil").textContent = (usuario.nombre || "U").charAt(0).toUpperCase();
    } else {
        mostrar("mensajePerfil", "Inicia sesión o crea una cuenta para editar tu perfil.");
        formPerfil.querySelectorAll("input, button").forEach(el => el.disabled = true);
    }
    formPerfil.addEventListener("submit", (e) => {
        e.preventDefault();
        const actual = usuarioActual();
        if (!actual) return;
        const actualizado = {
            ...actual,
            nombre: document.getElementById("perfilNombre").value.trim(),
            telefono: document.getElementById("perfilTelefono").value.trim(),
            correo: document.getElementById("perfilCorreo").value.trim().toLowerCase()
        };
        const usuarios = leer("petmatch_usuarios", []);
        const indice = usuarios.findIndex(u => u.correo === actual.correo);
        if (indice >= 0) usuarios[indice] = actualizado;
        guardar("petmatch_usuarios", usuarios); guardar("petmatch_usuario", actualizado);
        document.getElementById("nombrePerfil").textContent = actualizado.nombre;
        document.getElementById("correoPerfil").textContent = actualizado.correo;
        document.getElementById("inicialPerfil").textContent = actualizado.nombre.charAt(0).toUpperCase();
        mostrar("mensajePerfil", "Tus datos se actualizaron correctamente.");
    });
}
const cerrarSesion = document.getElementById("cerrarSesion");
if (cerrarSesion) cerrarSesion.addEventListener("click", () => localStorage.removeItem("petmatch_usuario"));

// Formulario de registrar mascotas
const formMascota = document.getElementById("formMascota");
if (formMascota) {
    formMascota.addEventListener("submit", async (e) => {
        e.preventDefault();
        const usuario = usuarioActual();
        if (!usuario) return mostrar("mensajeMascota", "Primero debes iniciar sesión para publicar una mascota.");
        const archivo = document.getElementById("fotoMascota").files[0];
        let foto = "";
        if (archivo) {
            if (archivo.size > 700000) return mostrar("mensajeMascota", "La imagen debe pesar menos de 700 KB para este prototipo.");
            foto = await new Promise(resolve => {
                const lector = new FileReader();
                lector.onload = () => resolve(lector.result);
                lector.readAsDataURL(archivo);
            });
        }
        const mascotas = leer("petmatch_mascotas", []);
        mascotas.push({
            id: Date.now(), propietario: usuario.correo,
            nombre: document.getElementById("mascotaNombre").value.trim(),
            especie: document.getElementById("especieMascota").value,
            raza: document.getElementById("razaMascota").value.trim() || "No especificada",
            edad: document.getElementById("edadMascota").value.trim(),
            tamano: document.getElementById("tamanoMascota").value,
            sexo: document.getElementById("sexoMascota")?.value || "",
            ubicacion: document.getElementById("ubicacionMascota").value,
            estado: document.getElementById("estadoMascota").value,
            vacunas: document.getElementById("vacunasMascota")?.value || "",
            esterilizada: document.getElementById("esterilizadaMascota")?.value || "",
            descripcion: document.getElementById("descripcionMascota").value.trim(),
            foto
        });
        guardar("petmatch_mascotas", mascotas);
        mostrar("mensajeMascota", "¡Mascota publicada! Ya aparece en Mis publicaciones.");
        formMascota.reset();
        setTimeout(() => location.href = "publicaciones.html", 900);
    });
}

// Listado y administración de publicaciones
const lista = document.getElementById("listaPublicaciones");
if (lista) {
    const usuario = usuarioActual();
    const todas = leer("petmatch_mascotas", []);
    const propias = usuario ? todas.filter(m => m.propietario === usuario.correo) : [];
    const vacio = document.getElementById("mensajePublicaciones");
    if (!propias.length) {
        vacio.style.display = "block";
        if (!usuario) vacio.textContent = "Inicia sesión para consultar tus publicaciones.";
    } else {
        propias.forEach(m => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-publicacion";
            const foto = m.foto ? `<img src="${m.foto}" alt="Fotografía de ${m.nombre}">` : "♡";
            tarjeta.innerHTML = `
                <div class="imagen-publicacion">${foto}</div>
                <div class="info-publicacion">
                    <span class="estado-publicacion">${m.estado}</span>
                    <h3>${escapar(m.nombre)}</h3>
                    <p>${escapar(m.especie)} · ${escapar(m.raza)}<br>${escapar(m.edad)} · ${escapar(m.tamano)}<br>${escapar(m.ubicacion)}</p>
                    <div class="botones-publicacion">
                        <button class="boton-borde" data-editar="${m.id}" type="button">Editar</button>
                        <button class="boton-cafe" data-eliminar="${m.id}" type="button">Eliminar</button>
                    </div>
                </div>`;
            lista.appendChild(tarjeta);
        });
    }
    lista.addEventListener("click", (e) => {
        const idEditar = e.target.dataset.editar;
        const idEliminar = e.target.dataset.eliminar;
        if (!idEditar && !idEliminar) return;

        const actual = usuarioActual();
        if (!actual) return location.reload();

        const id = Number(idEditar || idEliminar);
        const publicacion = leer("petmatch_mascotas", []).find(m => m.id === id && m.propietario === actual.correo);
        if (!publicacion) return location.reload();

        if (idEliminar) {
            if (confirm("¿Deseas eliminar esta publicación?") && usuarioActual()?.correo === actual.correo) {
                const recientes = leer("petmatch_mascotas", []);
                guardar("petmatch_mascotas", recientes.filter(m => m.id !== id || m.propietario !== actual.correo));
                location.reload();
            }
        }
        if (idEditar) {
            const nuevoEstado = prompt("Actualiza el estado (Disponible / En proceso):", publicacion.estado);
            if (nuevoEstado && ["Disponible", "En proceso"].includes(nuevoEstado)) {
                const recientes = leer("petmatch_mascotas", []);
                const mascota = recientes.find(m => m.id === id && m.propietario === actual.correo);
                if (mascota && usuarioActual()?.correo === actual.correo) {
                    mascota.estado = nuevoEstado;
                    guardar("petmatch_mascotas", recientes);
                }
                location.reload();
            } else if (nuevoEstado) alert("Escribe Disponible o En proceso.");
        }
    });
}
function escapar(valor) {
    return String(valor).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
