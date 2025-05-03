
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Lista de Empleados</title>
    <link rel="stylesheet" href="../assets/libs/Bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/libs/Bootstrap/bootstrap-icons.css">
    <link rel="stylesheet" href="../assets/css/Empleado.css">

</head>
<body>
<div class="container mt-2 p-4 shadow rounded bg-white">
        <h2 class="text-center">Lista de Empleados</h2>
        <div class="row mb-3">
    <div class="col-md-6">
        <label for="filtroDepartamento" class="form-label">Filtrar por departamento:</label>
        <select id="filtroDepartamento" class="form-control">
            <option value="">Cargando...</option>
        </select>
    </div>
    <div class="col-md-6">
        <label for="filtroApellido" class="form-label">Filtrar por apellido:</label>
        <input type="text" id="filtroApellido" class="form-control" placeholder="Escribe un apellido">
    </div>
</div>

<div class="table-responsive">
    <table class="table table-hover table-striped table-bordered table-sm">
        <thead class="text-center bg-primary text-white">
            <tr >
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Departamento</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody id="tablaEmpleados" class="text-center">
        </tbody>
    </table>
</div>

        <div id="controlesPaginacion" class="text-center"></div>

        <div class="d-flex justify-content-center mt-3">
    <button class="btn btn-primary btn-md" onclick="modalAlta()">
        <i class="bi bi-person-vcard-fill"></i> Alta Empleado
    </button>
</div>
</div>
   <!-- Modal de edición -->
<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog modal-md">
        <div class="modal-content rounded shadow">
        <div class="modal-header bg-primary text-white justify-content-center">
    <h5 class="modal-title w-100 text-center"> Editar Empleado</h5>
    <button type="button" class="btn-close text-white" data-bs-dismiss="modal"></button>
</div>


            <div class="modal-body p-3 bg-light">
                <input type="hidden" id="idEmpleadoEditar">

                <div class="form-floating mb-2">
                    <input type="text" id="nombreEmpleadoEditar" maxlength="50" class="form-control shadow-sm" placeholder="Nombre">
                    <label for="nombreEmpleado">Nombre</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="text" id="apellidoPaternoEditar" maxlength="50" class="form-control shadow-sm" placeholder="Apellido Paterno">
                    <label for="apellidoPaterno">Apellido Paterno</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="text" id="apellidoMaternoEditar" maxlength="50" class="form-control shadow-sm" placeholder="Apellido Materno">
                    <label for="apellidoMaterno">Apellido Materno</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="number" id="edadEmpleadoEditar" class="form-control shadow-sm" placeholder="Edad">
                    <label for="edadEmpleado">Edad</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="email" id="correoEmpleadoEditar" maxlength="100" class="form-control shadow-sm" placeholder="Correo">
                    <label for="correoEmpleado">Correo</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="number" id="telefonoEmpleadoEditar" pattern="[0-9]" class="form-control shadow-sm" placeholder="Teléfono">
                    <label for="telefonoEmpleado">Teléfono</label>
                </div>

                <div class="form-group mb-2">
                    <label for="departamentoSelect">Departamento:</label>
                    <select id="departamentoSelect" class="form-control shadow-sm">
                        <option value="">Cargando...</option>
                    </select>
                </div>

            </div>
            <div class="modal-footer justify-content-center p-2">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><i class="bi bi-arrow-return-left"></i>  Cancelar</button>
                    <button type="button" class="btn btn-primary btn-sm" id="guardarCambios" onclick="editarEmpleado()"><i class="bi bi-floppy"></i> Guardar</button>
            </div>
        </div>
    </div>
</div>



<!-- Modal de guardado -->
<div class="modal fade" id="modalAlta" tabindex="-1">
    <div class="modal-dialog modal-md">
        <div class="modal-content rounded-3 shadow-lg">
            <div class="modal-header bg-primary text-white text-center justify-content-center p-2">
                <h5 class="modal-title w-100 text-center"> Alta de Empleado</h5>
                <button type="button" class="btn-close text-white" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-3 bg-light">
                <input type="hidden" id="empleadoID">

                <div class="form-floating mb-2">
                    <input type="text" id="nombreEmpleadoAlta" maxlength="50" class="form-control shadow-sm" placeholder="Nombre">
                    <label for="nombreEmpleado">Nombre</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="text" id="apellidoPaternoAlta" maxlength="50" class="form-control shadow-sm" placeholder="Apellido Paterno">
                    <label for="apellidoPaterno">Apellido Paterno</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="text" id="apellidoMaternoAlta" maxlength="50" class="form-control shadow-sm" placeholder="Apellido Materno">
                    <label for="apellidoMaterno">Apellido Materno</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="number" id="edadEmpleadoAlta" class="form-control shadow-sm" placeholder="Edad">
                    <label for="edadEmpleado">Edad</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="email" id="correoEmpleadoAlta" maxlength="50" class="form-control shadow-sm" placeholder="Correo">
                    <label for="correoEmpleado">Correo</label>
                </div>

                <div class="form-floating mb-2">
                    <input type="number" id="telefonoEmpleadoAlta" pattern="[0-9]{10}" class="form-control shadow-sm" placeholder="Teléfono">
                    <label for="telefonoEmpleado">Teléfono</label>
                </div>

                <div class="form-group mb-2">
                    <label for="departamentoSelectAlta">Departamento:</label>
                    <select id="departamentoSelectAlta" class="form-control shadow-sm">
                        <option value="">Cargando...</option>
                    </select>
                </div>

            </div>
            <div class="modal-footer justify-content-center p-2">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                    <i class="bi bi-arrow-return-left"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-primary btn-sm" id="guardarEmpleado" onclick="guardarEmpleado()">
                    <i class="bi bi-floppy"></i> Guardar
                    </button>
            </div>
        </div>
    </div>
</div>




    <script src="../assets/js/empleados.js"></script>
    <script src="../assets/libs/Bootstrap/bootstrap.bundle.js"></script>
    <script src="../assets/libs/SweetAlert/sweetalert2.all.min.js"> </script>


</body>
</html>
