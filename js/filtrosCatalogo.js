const formularioFiltros = document.querySelector(".formulario-filtros");

if (formularioFiltros) {
    const listas = formularioFiltros.querySelectorAll("select");

    listas.forEach(function (lista) {
        lista.addEventListener("change", function () {
            formularioFiltros.submit();
        });
    });
}
