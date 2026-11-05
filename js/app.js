
console.log('PetMatch CR - JavaScript conectado');


// Mascotas de ejemplo
const mascotas = [
    {
        id: 'milo',
        especie: 'perro',
        raza: 'mestizo',
        edad: 'joven',
        tamano: 'mediano',
        ubicacion: 'alajuela',
        estado: 'disponible'
    },
    {
        id: 'luna',
        especie: 'gato',
        raza: 'no-especificada',
        edad: 'joven',
        tamano: 'pequeno',
        ubicacion: 'san-jose',
        estado: 'disponible'
    },
    {
        id: 'canela',
        especie: 'perro',
        raza: 'mestizo',
        edad: 'cachorro',
        tamano: 'pequeno',
        ubicacion: 'heredia',
        estado: 'disponible'
    },
    {
        id: 'max',
        especie: 'perro',
        raza: 'mestizo',
        edad: 'cachorro',
        tamano: 'grande',
        ubicacion: 'cartago',
        estado: 'disponible'
    },
    {
        id: 'nala',
        especie: 'gato',
        raza: 'no-especificada',
        edad: 'joven',
        tamano: 'pequeno',
        ubicacion: 'san-jose',
        estado: 'disponible'
    },
    {
        id: 'toby',
        especie: 'perro',
        raza: 'salchicha',
        edad: 'adulto',
        tamano: 'pequeno',
        ubicacion: 'alajuela',
        estado: 'disponible'
    }
];

// Filtros Catalogo
const filtroEspecie = document.querySelector('#especie');
const filtroRaza = document.querySelector('#raza');
const filtroEdad = document.querySelector('#edad');
const filtroTamano = document.querySelector('#tamano');
const filtroUbicacion = document.querySelector('#ubicacion');
const filtroEstado = document.querySelector('#estado');

const cantidadMascotas = document.querySelector('.cantidad-mascotas');
const mensajeSinResultados = document.querySelector('#mensajeSinResultados');

function filtrarMascotas() {

    const especie = filtroEspecie.value;
    const raza = filtroRaza.value;
    const edad = filtroEdad.value;
    const tamano = filtroTamano.value;
    const ubicacion = filtroUbicacion.value;
    const estado = filtroEstado.value;

    const mascotasFiltradas = mascotas.filter(function(mascota) {
        return (especie === '' || mascota.especie === especie) &&
               (raza === '' || mascota.raza === raza) &&
               (edad === '' || mascota.edad === edad) &&
               (tamano === '' || mascota.tamano === tamano) &&
               (ubicacion === '' || mascota.ubicacion === ubicacion) &&
               (estado === '' || mascota.estado === estado);
    });

    mascotas.forEach(function(mascota) {
        const tarjeta = document.getElementById(mascota.id);
        tarjeta.style.display = 'none';
    });

    mascotasFiltradas.forEach(function(mascota) {
        const tarjeta = document.getElementById(mascota.id);
        tarjeta.style.display = '';
    });

    if (mascotasFiltradas.length === 1) {
        cantidadMascotas.textContent = '1 mascota';
    } else {
        cantidadMascotas.textContent = mascotasFiltradas.length + ' mascotas';
    }

    if (mascotasFiltradas.length === 0) {
        mensajeSinResultados.style.display = 'block';
    } else {
        mensajeSinResultados.style.display = 'none';
    }
}

filtroEspecie.addEventListener('input', filtrarMascotas);
filtroRaza.addEventListener('input', filtrarMascotas);
filtroEdad.addEventListener('input', filtrarMascotas);
filtroTamano.addEventListener('input', filtrarMascotas);
filtroUbicacion.addEventListener('input', filtrarMascotas);
filtroEstado.addEventListener('input', filtrarMascotas);

// Limpiar filtros
const botonLimpiar = document.querySelector('#btnLimpiarFiltros');

botonLimpiar.addEventListener('click', function() {

    filtroEspecie.value = '';
    filtroRaza.value = '';
    filtroEdad.value = '';
    filtroTamano.value = '';
    filtroUbicacion.value = '';
    filtroEstado.value = '';

    filtrarMascotas();
});
