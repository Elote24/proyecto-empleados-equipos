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

        await llenarDepartamentos(); 
        configurarPaginacion(data); 

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}




function mostrarEmpleados() {
    let tabla = document.querySelector("#tablaEmpleados");
    tabla.innerHTML = ""; 

    let inicio = (paginaActual - 1) * empleadosPorPagina;
    let fin = inicio + empleadosPorPagina;    
    let listaParaMostrar;
    if(document.getElementById("filtroDepartamento").value==0 && document.getElementById("filtroApellido").value==""){
         listaParaMostrar = empleadosFiltrados.length > 0 ? empleadosFiltrados : empleados;

    }else{
     listaParaMostrar = empleadosFiltrados.length > 0 ? empleadosFiltrados : [];
    }

    let empleadosPagina = listaParaMostrar.slice(inicio, fin);

    if (listaParaMostrar.length === 0) {
        document.querySelector("#tablaEmpleados").innerHTML = "<tr class='text-center'><td colspan='8'>No se encontraron empleados</td></tr>";
        return;
    }



    empleadosPagina.forEach(empleado => {
        let fila = `
            <tr>
                <td>${empleado.ID}</td>
                <td>${empleado.Nombre}</td>
                <td>${empleado.Apellido_Paterno} ${empleado.Apellido_Materno}</td>
                <td>${empleado.Edad}</td>
                <td>${empleado.Correo}</td>
                <td>${empleado.numero_telefono || "No disponible"}</td>
                <td>${empleado.Nombre_Departamento}</td>
                <td class="text-center">
                <button class="btn btn-info btn-sm rounded-circle" onclick="modalEditar(${empleado.ID},'${empleado.Nombre}','${empleado.Apellido_Paterno}','${empleado.Apellido_Materno}',${empleado.Edad},'${empleado.Correo}',${empleado.numero_telefono},${empleado.ID_Departamento})">
                <i class="bi bi-pencil"></i>
            </button>               
            <button class="btn btn-danger btn-sm rounded-circle" onclick="eliminarEmpleado(${empleado.ID})">
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
        <button ${paginaActual === 1 ? "disabled" : ""} onclick="cambiarPagina(-1)">◀ Anterior</button>
        Página ${paginaActual} de ${totalPaginas}
        <button ${paginaActual === totalPaginas ? "disabled" : ""} onclick="cambiarPagina(1)">Siguiente ▶</button>
    `;
}

function cambiarPagina(direccion) {
    paginaActual += direccion;
    mostrarEmpleados();
}



document.getElementById("filtroDepartamento").addEventListener("change", function () {
    document.getElementById("filtroApellido").value="";
    let departamentoSeleccionado = this.value;

    empleadosFiltrados = departamentoSeleccionado == 0
        ? empleados 
        : empleados.filter(emp => emp.ID_Departamento == departamentoSeleccionado); 
    

        mostrarEmpleados(); 
});

document.getElementById("filtroApellido").addEventListener("input", function () {
    document.getElementById("filtroDepartamento").value=0;
    let apellidoBuscado = this.value.trim().toLowerCase(); 
    paginaActual = 1; 

    empleadosFiltrados = apellidoBuscado.trim() !== ""
    ? empleados.filter(emp => `${emp.Apellido_Paterno} ${emp.Apellido_Materno}`.toLowerCase().includes(apellidoBuscado))
    : []; 


    mostrarEmpleados(); 
});




function configurarPaginacion(listaEmpleados) {
    empleados = listaEmpleados; 
    paginaActual = 1; 
    mostrarEmpleados(); 
}




function modalEditar(id,nombre,ApellidoPaterno,ApellidoMaterno,edad,correo,telefono,departamento) {
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


function modalAlta() {
    limpiarCamposAlta();
    let modal = new bootstrap.Modal(document.getElementById("modalAlta"));
    llenarDepartamentosAlta()
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
        const result = await Swal.fire({
            title: "¿Quieres guardar este empleado?",
            text: "Se registrará en la base de datos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return; 

        if (!validarCorreo(correo)) {
            await Swal.fire({ icon: "error", title: "Error", text: "Correo electrónico inválido." });
            return;
        }

        if (!validarEdad(edad)) {
            await Swal.fire({ icon: "error", title: "Error", text: "La edad debe ser entre 18 y 65 años." });
            return;
        }

        if (!validarTelefono(telefono)) {
            await Swal.fire({ icon: "error", title: "Error", text: "El número de teléfono debe tener 10 dígitos." });
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
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            await Swal.fire({
                title: "Error",
                text: data.mensaje.join("\n"),
                icon: "error",
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#d33"
            });
        } else {
            await Swal.fire({
                title: "¡Empleado Guardado!",
                text: "El empleado ha sido registrado exitosamente.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6"
            });

            let modal = document.getElementById("modalAlta"); 
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            await actualizarTabla();
        }
        
    } catch (error) {
        console.error("Error:", error);
        await Swal.fire({
            title: "Error",
            text: "No se pudo guardar el empleado.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
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
        const result = await Swal.fire({
            title: "¿Quieres modificar este empleado?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return; 

        if (!validarCorreo(correo)) {
            await Swal.fire({ icon: "error", title: "Error", text: "Correo electrónico inválido." });
            return;
        }

        if (!validarEdad(edad)) {
            await Swal.fire({ icon: "error", title: "Error", text: "La edad debe ser entre 18 y 65 años." });
            return;
        }

        if (!validarTelefono(telefono)) {
            await Swal.fire({ icon: "error", title: "Error", text: "El número de teléfono debe tener 10 dígitos." });
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
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            await Swal.fire({
                title: "Error",
                text: data.mensaje.join("\n"),
                icon: "error",
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#d33"
            });
        } else {
            await Swal.fire({
                title: "¡Empleado Guardado!",
                text: "El empleado ha sido modificado exitosamente.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6"
            });

            let modal = document.getElementById("modalEditar");
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            await actualizarTabla();
        }
        
    } catch (error) {
        console.error("Error:", error);
        await Swal.fire({
            title: "Error",
            text: "No se pudo modificar el empleado.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
    }
}


function eliminarEmpleado (id) {
    Swal.fire({
        title: "¿Quieres eliminar este empleado?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
    let formData = new FormData();
    formData.append("id", id);

    fetch("../empleados/eliminar.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.error) {
            Swal.fire({
                title: "Error",
                text: data.mensaje.join("\n"),
                icon: "error",
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#d33"
            });
        } else {
            Swal.fire({
                title: "¡Empleado Eliminado!",
                text: "El empleado ha sido eliminado exitosamente.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6"
            });
            actualizarTabla();
            
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el empleado.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
    });
}
});
}

function llenarDepartamentosEditar(departamento ){
    fetch("../empleados/listarDepartamentos.php") 
        .then(response => response.json()) 
        .then(departamentos => {
            let select = document.getElementById("departamentoSelect");
            select.innerHTML = ""; 

            departamentos.forEach(depto => {
                let option = document.createElement("option");
                option.value = depto.ID;
                option.textContent = depto.Nombre;
                select.appendChild(option);
            });
            if (departamento) {
                select.value = departamento;
            }
        })
        .catch(error => console.error("Error al cargar los departamentos:", error));
};

function llenarDepartamentos( ){
    fetch("../empleados/listarDepartamentos.php") 
        .then(response => response.json()) 
        .then(departamentos => {
            let select = document.getElementById("filtroDepartamento");
            select.innerHTML = ""; 
            let option = document.createElement("option");
            option.value = "0";
            option.textContent = "TODOS";
            select.appendChild(option);
            departamentos.forEach(depto => {
                let option = document.createElement("option");
                option.value = depto.ID;
                option.textContent = depto.Nombre;
                select.appendChild(option);
            });

            
        })
        .catch(error => console.error("Error al cargar los departamentos:", error));
};

function llenarDepartamentosAlta(){
    fetch("../empleados/listarDepartamentos.php") 
        .then(response => response.json()) 
        .then(departamentos => {
            let select = document.getElementById("departamentoSelectAlta");
            select.innerHTML = ""; 

            departamentos.forEach(depto => {
                let option = document.createElement("option");
                option.value = depto.ID;
                option.textContent = depto.Nombre;
                select.appendChild(option);
            });
            if (departamento) {
                select.value = departamento;
            }
        })
        .catch(error => console.error("Error al cargar los departamentos:", error));
};


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






