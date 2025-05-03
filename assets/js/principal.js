function cargarPagina(url) {
    document.getElementById("contenido").src = url;
    document.getElementById("mensajeBienvenida").style.display = "none"; 
}

function mostrarBienvenida() {
    document.getElementById("contenido").src = ""; 
    document.getElementById("mensajeBienvenida").style.display = "block"; 
}