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
        if (!data || data.length === 0 || data.error) {
            document.querySelector("#tablaEquipos").innerHTML = "<tr class='text-center'><td colspan='8'>No se encontraron Equipos</td></tr>";
            return;
        }
        equipos = data;
        configurarPaginacion(data); 

    } catch (error) {
        document.querySelector("#tablaEquipos").innerHTML = "<tr class='text-center'><td colspan='8'>Ocurrio un error al cargar los equipos</td></tr>";
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

    const result = await mostrarConfirmacion("¿Quieres guardar este equipo?", "");
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
            mostrarError("Error", data.mensaje);
        } else {
            mostrarExito("¡Equipo Guardado!", data.mensaje);

            let modal = document.getElementById("modalAlta"); 
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            await actualizarTabla(); 
        }

    } catch (error) {
        console.error("Error:", error);
        mostrarError("Error", error.mensaje);
    }
}



async function editarEquipo() {
    let id = document.getElementById("idEquipoEditar").value;
    let nombre = document.getElementById("nombreEquipoEditar").value;
    let tipo = document.getElementById("tipoEditar").value;
    let numeroSerie = document.getElementById("numeroSerieEditar").value;

    try {
        const result = await mostrarConfirmacion("¿Quieres modificar este equipo?", "");
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
            mostrarError("Error", data.mensaje);

        } else {
            mostrarExito("¡Equipo Modificado!", data.mensaje);

            let modal = document.getElementById("modalEditar");
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            await actualizarTabla(); 
        }

    } catch (error) {
        console.error("Error:", error);
        mostrarError("Error", "No se pudo modificar el equipo.");
    }
}



async function asignarEquipo () { 
    let id= document.getElementById("idEquipoAsignar").value;
    let empleado= document.getElementById("empleadoSelectAlta").value;
    if (empleado=="") {
        mostrarError("Error", "Selecciona un empleado.");
        return;
    }
    try{
    const result = await mostrarConfirmacion("¿Quieres asignar este equipo?", "");
        if (!result.isConfirmed) return;
    let formData = new FormData();
    formData.append("id", id);
    formData.append("empleado", empleado);


    const response = await fetch("../equipos/asignarEquipo.php", {
        method: "POST",
        body: formData
    })

    const data = await response.json();

    if (data.error) {
        mostrarError("Error", data.mensaje);

    }  else {
            mostrarExito("Equipo Asignado!", data.mensaje);
            let modal = document.getElementById("modalASignar"); 
            let modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            actualizarTabla();
            
        }
    }
    catch(error ) {
        console.error("Error:", error);
        mostrarError("Error", "No se pudo asignar el equipo.");
}
}




async function eliminarEquipo (id) {
    try{
    const result = await mostrarConfirmacion("Estas seguro que deseas eliminar este equipo?", "Se eliminara el equipo para siempre.");
    if (!result.isConfirmed) return;
    let formData = new FormData();
    formData.append("id", id);

    const response = await fetch("../equipos/eliminar.php", {
        method: "POST",
        body: formData
    })
    const data = await response.json();

        if (data.error) {
            mostrarError("Error", data.mensaje.join("\n"));
        }

         else {
            mostrarExito("Equipo Eliminado!", data.mensaje);
            actualizarTabla();
            
        }
    }
    catch(error) {
        console.error("Error:", error);
        mostrarError("Error", "No se pudo eliminar el equipo.");
    }
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


