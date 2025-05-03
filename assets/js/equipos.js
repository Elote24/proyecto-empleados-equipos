let equipos = []; 
let equiposFiltrados = [];
let equiposPorPagina = 8; 
let paginaActual = 1; 

document.addEventListener("DOMContentLoaded", actualizarTabla);

async function actualizarTabla() {
    try {
        const response = await fetch("../equipos/listar.php");
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        equipos = data;
        configurarPaginacion(data); 

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}




function mostrarEquipos() {
    let tabla = document.querySelector("#tablaEquipos");
    tabla.innerHTML = ""; 

    let inicio = (paginaActual - 1) * equiposPorPagina;
    let fin = inicio + equiposPorPagina;    
    let listaParaMostrar;
    if( document.getElementById("filtroApellido").value==""){
        listaParaMostrar = equiposFiltrados.length > 0 ? equiposFiltrados : equipos;

   }else{
    listaParaMostrar = equiposFiltrados.length > 0 ? equiposFiltrados : [];
   }

    
    let equiposPagina = listaParaMostrar.slice(inicio, fin);

    if (listaParaMostrar.length === 0) {
        document.querySelector("#tablaEquipos").innerHTML = "<tr class='text-center'><td colspan='8'>No se encontraron equipos</td></tr>";
        return;
    }



    equiposPagina.forEach(equipo => {
        let fila = `
            <tr>
                <td>${equipo.ID}</td>
                <td>${equipo.Nombre}</td>
                <td>${equipo.Tipo}</td>
                <td>${equipo.Numero_Serie}</td>
                <td>${equipo.Nombre_Empleado}</td>
                <td class="text-center">
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-info btn-sm rounded-circle shadow-sm" onclick="modalEditar(${equipo.ID},'${equipo.Nombre}','${equipo.Tipo}','${equipo.Numero_Serie}','${equipo.Nombre_Empleado}')">
                        <i class="bi bi-pencil"></i>
                    </button>
            
                    <button class="btn btn-danger btn-sm shadow-sm rounded-circle" onclick="eliminarEquipo(${equipo.ID})">
                        <i class="bi bi-trash"></i>
                    </button>
            
                    <button class="btn btn-success btn-sm shadow-sm " title="Asigna un empleado al equpo" onclick="modalAsignar(${equipo.ID},'${equipo.Nombre}','${equipo.Numero_Serie}',${equipo.ID_Empleado})">
                        <i class="bi bi-person-plus"></i> Asignar
                    </button>
                </div>
            </td>
            
            </tr>
        `;
        tabla.innerHTML += fila;
    });

    actualizarControles();
}

function configurarPaginacion(listaEquipos) {
    equipos = listaEquipos; 
    paginaActual = 1; 
    mostrarEquipos(); 
}



function actualizarControles() {
    let totalPaginas = Math.ceil(equipos.length / equiposPorPagina);
    let controles = document.getElementById("controlesPaginacion");
    controles.innerHTML = `
        <button ${paginaActual === 1 ? "disabled" : ""} onclick="cambiarPagina(-1)">◀ Anterior</button>
        Página ${paginaActual} de ${totalPaginas}
        <button ${paginaActual === totalPaginas ? "disabled" : ""} onclick="cambiarPagina(1)">Siguiente ▶</button>
    `;
}


function cambiarPagina(direccion) {
    paginaActual += direccion;
    mostrarEquipos();
}

document.getElementById("filtroApellido").addEventListener("input", function () {
    let apellidoBuscado = this.value.trim().toLowerCase();
    paginaActual = 1; 

    equiposFiltrados = apellidoBuscado
        ? equipos.filter(eq => `${eq.Nombre_Empleado} `.toLowerCase().includes(apellidoBuscado))
        : []; 

    mostrarEquipos(); 
});



function modalAlta() {
    limpiarCamposAlta();
    let modal = new bootstrap.Modal(document.getElementById("modalAlta"));
    modal.show();

}


function modalEditar(id,nombre,tipo,numeroSerie,empleado) {
    document.getElementById("idEquipoEditar").value = id;
    document.getElementById("nombreEquipoEditar").value = nombre;
    document.getElementById("tipoEditar").value = tipo;
    document.getElementById("numeroSerieEditar").value = numeroSerie;
    document.getElementById("empleadoAsignadoEditar").value = empleado;

    let modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
}

async function modalAsignar(id,nombre,numeroSerie,empleado) {
    await llenarEmpleados();
    document.getElementById("idEquipoAsignar").value = id;
    document.getElementById("nombreEqupoAsignar").value = nombre;
    document.getElementById("numeroSerieAsignar").value = numeroSerie;
    

    let modal = new bootstrap.Modal(document.getElementById("modalASignar"));
    modal.show();
    
        document.getElementById("empleadoSelectAlta").value = empleado;


}

async function guardarEquipo() {
    let nombre = document.getElementById("nombreEquipoAlta").value;
    let tipo = document.getElementById("tipoAlta").value;
    let numeroSerie = document.getElementById("numeroSerieAlta").value;

    const result = await Swal.fire({
        title: "¿Quieres guardar este equipo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return; 
    let formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("tipo", tipo);
    formData.append("numeroSerie", numeroSerie);

    try {
        const response = await fetch("../equipos/crear.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

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
                title: "Equipo Guardado!",
                text: "El equipo ha sido creado exitosamente.",
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
        Swal.fire({
            title: "Error",
            text: "No se pudo guardar el equipo.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
    }
}



async function editarEquipo() {
    let id = document.getElementById("idEquipoEditar").value;
    let nombre = document.getElementById("nombreEquipoEditar").value;
    let tipo = document.getElementById("tipoEditar").value;
    let numeroSerie = document.getElementById("numeroSerieEditar").value;

    try {
        const result = await Swal.fire({
            title: "¿Quieres modificar este equipo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return; 

        let formData = new FormData();
        formData.append("id", id);
        formData.append("nombre", nombre);
        formData.append("tipo", tipo);
        formData.append("numeroSerie", numeroSerie);

        const response = await fetch("../equipos/editar.php", {
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
                title: "Equipo Modificado!",
                text: "El equipo ha sido actualizado exitosamente.",
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
            text: "No se pudo modificar el equipo.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
    }
}



function asignarEquipo () { 
    let id= document.getElementById("idEquipoAsignar").value;
    let empleado= document.getElementById("empleadoSelectAlta").value;
    if (empleado=="") {
         Swal.fire({ icon: "error", title: "Error", text: "Selecciona un Empleado " });
        return;
    }

    Swal.fire({
        title: "¿Quieres asignar este equipo?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, asignar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("empleado", empleado);


    fetch("../equipos/asignarEquipo.php", {
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
                title: "Equipo Asignado!",
                text: "El equipo ha sido asignado exitosamente.",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6"
            });
            let modal = document.getElementById("modalASignar"); 
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            actualizarTabla();
            
            
            
            
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo asignar el equipo.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
    });
}
});
}



function eliminarEquipo (id) {
    Swal.fire({
        title: "¿Quieres eliminar este equipo?",
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

    fetch("../equipos/eliminar.php", {
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
                title: "Equipo Eliminado!",
                text: "El equipo ha sido eliminado exitosamente.",
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
            text: "No se pudo eliminar el equipo.",
            icon: "error",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#d33"
        });
    });
}
});
}

async function llenarEmpleados() {
    try {
        const response = await fetch("../empleados/listar.php");  
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const empleados = await response.json();  
        
        let select = document.getElementById("empleadoSelectAlta");
        select.innerHTML = "";  

        let option = document.createElement("option");
        option.value = "null";
        option.textContent = "No asignar";
        select.appendChild(option);

        empleados.forEach(emp => {
            let option = document.createElement("option");
            option.value = emp.ID;
            option.textContent = `${emp.Nombre} ${emp.Apellido_Paterno} ${emp.Apellido_Materno}`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar los empleados:", error);
    }
}


function limpiarCamposAlta() {
    document.getElementById("nombreEquipoAlta").value = "";
    document.getElementById("tipoAlta").value = "";
    document.getElementById("numeroSerieAlta").value = "";
}





