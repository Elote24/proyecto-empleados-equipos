let empleados = [];
let empleadosFiltrados = [];
let empleadosPorPagina = 8;
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", actualizarTabla);

async function actualizarTabla() {
  try {
    const response = await fetch("../empleados/listar.php");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    empleados = data;

    if (!data || data.length === 0 || data.error) {
      document.querySelector("#tablaEmpleados").innerHTML =
        "<tr class='text-center'><td colspan='8'>No se encontraron empleados</td></tr>";
      return;
    }

    await llenarDepartamentos();
    configurarPaginacion(data);
  } catch (error) {
    document.querySelector("#tablaEmpleados").innerHTML =
      "<tr class='text-center'><td colspan='8'>Ocurrio un error al cargar empleados</td></tr>";
    console.error("Error al cargar los datos:", error);
  }
}

function mostrarEmpleados() {
  let tabla = document.querySelector("#tablaEmpleados");
  tabla.innerHTML = "";

  let inicio = (paginaActual - 1) * empleadosPorPagina;
  let fin = inicio + empleadosPorPagina;
  let listaParaMostrar;
  if (
    document.getElementById("filtroDepartamento").value == 0 &&
    document.getElementById("filtroApellido").value == ""
  ) {
    listaParaMostrar =
      empleadosFiltrados.length > 0 ? empleadosFiltrados : empleados;
  } else {
    listaParaMostrar = empleadosFiltrados.length > 0 ? empleadosFiltrados : [];
  }

  let empleadosPagina = listaParaMostrar.slice(inicio, fin);

  if (listaParaMostrar.length === 0) {
    document.querySelector("#tablaEmpleados").innerHTML =
      "<tr class='text-center'><td colspan='8'>No se encontraron empleados</td></tr>";
    return;
  }

  empleadosPagina.forEach((empleado) => {
    let fila = `
            <tr>
                <td>${empleado.ID}</td>
                <td>${empleado.Nombre}</td>
                <td>${empleado.Apellido_Paterno} ${
      empleado.Apellido_Materno
    }</td>
                <td>${empleado.Edad}</td>
                <td>${empleado.Correo}</td>
                <td>${empleado.numero_telefono || "No disponible"}</td>
                <td>${empleado.Nombre_Departamento}</td>
                <td class="text-center">
                <button class="btn btn-info btn-sm rounded-circle" onclick="modalEditar(${
                  empleado.ID
                },'${empleado.Nombre}','${empleado.Apellido_Paterno}','${
      empleado.Apellido_Materno
    }',${empleado.Edad},'${empleado.Correo}',${empleado.numero_telefono},${
      empleado.ID_Departamento
    })">
                <i class="bi bi-pencil"></i>
            </button>               
            <button class="btn btn-danger btn-sm rounded-circle" onclick="eliminarEmpleado(${
              empleado.ID
            })">
            <i class="bi bi-trash"></i>
        </button>
                        </td>
            </tr>
        `;
    tabla.innerHTML += fila;
  });

  actualizarControles();
}

function actualizarControles() {
  let totalPaginas = Math.ceil(empleados.length / empleadosPorPagina);
  let controles = document.getElementById("controlesPaginacion");
  controles.innerHTML = `
        <button ${
          paginaActual === 1 ? "disabled" : ""
        } onclick="cambiarPagina(-1)">◀ Anterior</button>
        Página ${paginaActual} de ${totalPaginas}
        <button ${
          paginaActual === totalPaginas ? "disabled" : ""
        } onclick="cambiarPagina(1)">Siguiente ▶</button>
    `;
}

function cambiarPagina(direccion) {
  paginaActual += direccion;
  mostrarEmpleados();
}

document
  .getElementById("filtroDepartamento")
  .addEventListener("change", function () {
    document.getElementById("filtroApellido").value = "";
    let departamentoSeleccionado = this.value;

    empleadosFiltrados =
      departamentoSeleccionado == 0
        ? empleados
        : empleados.filter(
            (emp) => emp.ID_Departamento == departamentoSeleccionado
          );

    mostrarEmpleados();
  });

document
  .getElementById("filtroApellido")
  .addEventListener("input", function () {
    document.getElementById("filtroDepartamento").value = 0;
    let apellidoBuscado = this.value.trim().toLowerCase();
    paginaActual = 1;

    empleadosFiltrados =
      apellidoBuscado.trim() !== ""
        ? empleados.filter((emp) =>
            `${emp.Apellido_Paterno} ${emp.Apellido_Materno}`
              .toLowerCase()
              .includes(apellidoBuscado)
          )
        : [];

    mostrarEmpleados();
  });

function configurarPaginacion(listaEmpleados) {
  empleados = listaEmpleados;
  paginaActual = 1;
  mostrarEmpleados();
}

function modalEditar(
  id,
  nombre,
  ApellidoPaterno,
  ApellidoMaterno,
  edad,
  correo,
  telefono,
  departamento
) {
  document.getElementById("idEmpleadoEditar").value = id;
  document.getElementById("nombreEmpleadoEditar").value = nombre;
  document.getElementById("apellidoPaternoEditar").value = ApellidoPaterno;
  document.getElementById("apellidoMaternoEditar").value = ApellidoMaterno;
  document.getElementById("edadEmpleadoEditar").value = edad;
  document.getElementById("correoEmpleadoEditar").value = correo;
  document.getElementById("telefonoEmpleadoEditar").value = telefono;

  let modal = new bootstrap.Modal(document.getElementById("modalEditar"));
  llenarDepartamentosEditar(departamento);
  modal.show();
}

async function modalAlta() {
  limpiarCamposAlta();
  let modal = new bootstrap.Modal(document.getElementById("modalAlta"));
  await llenarDepartamentosAlta();
  modal.show();
}

async function guardarEmpleado() {
  let nombre = document.getElementById("nombreEmpleadoAlta").value;
  let apellidoPaterno = document.getElementById("apellidoPaternoAlta").value;
  let apellidoMaterno = document.getElementById("apellidoMaternoAlta").value;
  let edad = document.getElementById("edadEmpleadoAlta").value;
  let correo = document.getElementById("correoEmpleadoAlta").value;
  let telefono = document.getElementById("telefonoEmpleadoAlta").value;
  let departamento = document.getElementById("departamentoSelectAlta").value;
  try {
    const result = await mostrarConfirmacion(
      "¿Quieres guardar este empleado?",
      ""
    );
    if (!result.isConfirmed) return;

    if (!validarCorreo(correo)) {
      mostrarError("Error", "Correo electrónico inválido.");
      return;
    }

    if (!validarEdad(edad)) {
      mostrarError("Error", "La edad debe ser entre 18 y 65 años.");
      return;
    }

    if (!validarTelefono(telefono)) {
      mostrarError("Error", "El número de teléfono debe tener 10 dígitos.");
      return;
    }

    let formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellidoPaterno", apellidoPaterno);
    formData.append("apellidoMaterno", apellidoMaterno);
    formData.append("edad", edad);
    formData.append("correo", correo);
    formData.append("telefono", telefono);
    formData.append("departamento", departamento);

    const response = await fetch("../empleados/crear.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.error) {
      mostrarError("Error", data.mensaje);
    } else {
      mostrarExito("¡Empleado Guardado!", data.mensaje);

      let modal = document.getElementById("modalAlta");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      await actualizarTabla();
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarError("Error", "No se pudo guardar el empleado.");
  }
}

async function editarEmpleado() {
  let id = document.getElementById("idEmpleadoEditar").value;
  let nombre = document.getElementById("nombreEmpleadoEditar").value;
  let apellidoPaterno = document.getElementById("apellidoPaternoEditar").value;
  let apellidoMaterno = document.getElementById("apellidoMaternoEditar").value;
  let edad = document.getElementById("edadEmpleadoEditar").value;
  let correo = document.getElementById("correoEmpleadoEditar").value;
  let telefono = document.getElementById("telefonoEmpleadoEditar").value;
  let departamento = document.getElementById("departamentoSelect").value;

  try {
    const result = await mostrarConfirmacion(
      "¿Quieres modificar este empleado?",
      ""
    );
    if (!result.isConfirmed) return;
    if (!validarCorreo(correo)) {
      mostrarError("Error", "Correo electrónico inválido.");
      return;
    }

    if (!validarEdad(edad)) {
      mostrarError("Error", "La edad debe ser entre 18 y 65 años.");
      return;
    }

    if (!validarTelefono(telefono)) {
      mostrarError("Error", "El número de teléfono debe tener 10 dígitos.");
      return;
    }

    let formData = new FormData();
    formData.append("id", id);
    formData.append("nombre", nombre);
    formData.append("apellidoPaterno", apellidoPaterno);
    formData.append("apellidoMaterno", apellidoMaterno);
    formData.append("edad", edad);
    formData.append("correo", correo);
    formData.append("telefono", telefono);
    formData.append("departamento", departamento);

    const response = await fetch("../empleados/editar.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      mostrarError("Error", data.mensaje);
    } else {
      mostrarExito("¡Empleado Modificado!", data.mensaje);

      let modal = document.getElementById("modalEditar");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      await actualizarTabla();
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarError("Error", "No se pudo modificar el empleado.");
  }
}

async function eliminarEmpleado(id) {
  try {
    const result = await mostrarConfirmacion(
      "¿Estas seguro que deseas eliminar este empleado?",
      "Se eliminara el empleado para siempre."
    );
    if (!result.isConfirmed) return;

    let formData = new FormData();
    formData.append("id", id);

    const response = await fetch("../empleados/eliminar.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.error) {
      mostrarError("Error", data.mensaje);
    } else {
      mostrarExito("¡Empleado Eliminado!", data.mensaje);
      await actualizarTabla();
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarError("Error", "No se pudo eliminar el empleado.");
  }
}

async function llenarDepartamentosEditar(departamento) {
  try {
    const response = await fetch("../empleados/listarDepartamentos.php");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    let select = document.getElementById("departamentoSelect");
    select.innerHTML = "";

    data.forEach((depto) => {
      let option = document.createElement("option");
      option.value = depto.ID;
      option.textContent = depto.Nombre;
      select.appendChild(option);
    });

    if (departamento) {
      select.value = departamento;
    }
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
}

async function llenarDepartamentos() {
  try {
    const response = await fetch("../empleados/listarDepartamentos.php");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.warn(data.error);
      return;
    }

    let select = document.getElementById("filtroDepartamento");
    select.innerHTML = "";

    let option = document.createElement("option");
    option.value = "0";
    option.textContent = "TODOS";
    select.appendChild(option);

    data.forEach((depto) => {
      let option = document.createElement("option");
      option.value = depto.ID;
      option.textContent = depto.Nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
}

async function llenarDepartamentosAlta() {
  try {
    const response = await fetch("../empleados/listarDepartamentos.php");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    let select = document.getElementById("departamentoSelectAlta");
    select.innerHTML = "";

    data.forEach((depto) => {
      let option = document.createElement("option");
      option.value = depto.ID;
      option.textContent = depto.Nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
}

function validarTelefono(telefono) {
  return /^\d{10}$/.test(telefono.trim());
}

function validarEdad(edad) {
  return /^\d+$/.test(edad) && edad >= 18 && edad <= 100;
}

function validarCorreo(correo) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function limpiarCamposAlta() {
  document.getElementById("nombreEmpleadoAlta").value = "";
  document.getElementById("apellidoPaternoAlta").value = "";
  document.getElementById("apellidoMaternoAlta").value = "";
  document.getElementById("edadEmpleadoAlta").value = "";
  document.getElementById("correoEmpleadoAlta").value = "";
  document.getElementById("telefonoEmpleadoAlta").value = "";
  document.getElementById("departamentoSelectAlta").value = "";
}
