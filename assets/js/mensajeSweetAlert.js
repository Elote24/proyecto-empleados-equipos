function mostrarError(titulo , mensaje ) {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "error",
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#d33",
  });
}

function mostrarExito( titulo ,mensaje) {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "success",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#28a745",
  });
}

function mostrarAdvertencia(titulo ,mensaje ) {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "warning",
    confirmButtonText: "Entendido",
    confirmButtonColor: "#ffc107",
  });
}

function mostrarConfirmacion(titulo , mensaje ) {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
    });
}

