
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
<div class="container mt-2 p-4 shadow rounded-3 bg-white">
    <h2 class="text-center mb-3"> Lista de Equipos</h2>

    <div class="mb-3">
        <label for="filtroApellido" class="form-label fw-bold"> Filtrar por Empleado:</label>
        <input type="text" id="filtroApellido" class="form-control shadow-sm" placeholder="Escribe el apellido">
    </div>

    <div class="table-responsive">
        <table class="table table-hover table-striped table-bordered table-sm">
            <thead class="text-center bg-primary text-white">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Número de Serie</th>
                    <th>Empleado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaEquipos" class="text-center"></tbody>
        </table>
    </div>
</div>


        <div id="controlesPaginacion" class="text-center"></div>

        <div class="d-flex justify-content-center mt-3">

        <button class="btn btn-primary btn-md" onclick="modalAlta()">
            <i class="bi bi-person-vcard-fill"></i> Alta Equipo
        </button>

        </div>



         <!-- Modal de edición -->
<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded">
            <div class="modal-header bg-primary text-white text-center justify-content-center p-3">
                <h5 class="modal-title  w-100  text-center"> Editar Equipo</h5>
                <button type="button" class="btn-close text-white" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-4">
                <input type="hidden" id="idEquipoEditar">
                <div class="form-floating mb-3">
                    <input type="text" id="nombreEquipoEditar" maxlength="100" class="form-control" placeholder="Nombre">
                    <label for="nombreEquipo">Nombre</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="tipoEditar" maxlength="50" class="form-control" placeholder="Tipo">
                    <label for="tipo">Tipo</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="numeroSerieEditar" maxlength="50" class="form-control" placeholder="Numero Serie" disabled>
                    <label for="numeroSerie">Numero Serie</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="empleadoAsignadoEditar" maxlength="100" class="form-control" placeholder="Empleado Asignado" disabled>
                    <label for="empleadoAsignado">Empleado Asignado</label>
                </div>

            </div>
            <div class="modal-footer justify-content-center gap-2 p-3">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><i class="bi bi-arrow-return-left"></i> Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" id="guardarCambios"onclick="editarEquipo()"><i class="bi bi-floppy"></i> Guardar</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal de guardado-->
<div class="modal fade" id="modalAlta" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded">
            <div class="modal-header bg-primary text-white text-center justify-content-center p-3">
                <h5 class="modal-title w-100  text-center"> Alta Equipo</h5>
                <button type="button" class="btn-close text-white" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-4">
                <div class="form-floating mb-3">
                    <input type="text" id="nombreEquipoAlta" maxlength="100" class="form-control" placeholder="Nombre">
                    <label for="nombreEquipo">Nombre</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="tipoAlta" maxlength="50" class="form-control" placeholder="Tipo">
                    <label for="tipo">Tipo</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="numeroSerieAlta" maxlength="50" class="form-control" placeholder="Numero Serie" >
                    <label for="numeroSerie">Numero Serie</label>
                </div>


            </div>
            <div class="modal-footer justify-content-center  p-3">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><i class="bi bi-arrow-return-left"></i> Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" id="guardarEmpleado" onclick="guardarEquipo()"><i class="bi bi-floppy"></i> Guardar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Asignar equipo-->
<div class="modal fade" id="modalASignar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content rounded">
            <div class="modal-header bg-primary text-white text-center justify-content-center p-3">
                <h5 class="modal-title w-100 text-center"> Asignar Equipo</h5>
                <button type="button" class="btn-close text-white" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-4">
            <input type="hidden" id="idEquipoAsignar">
                <div class="form mb-3">
                <label for="empleadoSelectAlta">Empleado:</label>
                    <select id="empleadoSelectAlta" class="form-control">
                        <option value="">Cargando...</option>
                    </select>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="nombreEqupoAsignar" maxlength="50" class="form-control" placeholder="Equipo" disabled>
                    <label for="tipo">Equipo</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" id="numeroSerieAsignar" maxlength="50" class="form-control" placeholder="Numero Serie" disabled>
                    <label for="numeroSerie">Numero Serie</label>
                </div>


            </div>
            <div class="modal-footer justify-content-center p-3">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><i class="bi bi-arrow-return-left"></i> Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" id="guardarEmpleado" onclick="asignarEquipo()"><i class="bi bi-floppy"></i> Guardar</button>
            </div>
        </div>
    </div>
</div>




    <script src="../assets/js/equipos.js"></script>
    <script src="../assets/libs/Bootstrap/bootstrap.bundle.js"></script>
    <script src="../assets/libs/SweetAlert/sweetalert2.all.min.js"> </script>


</body>
</html>
