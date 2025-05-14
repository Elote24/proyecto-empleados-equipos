<?php
//ini_set("display_errors", 1);
require_once "../empleados/Empleado.php";
$empleados = new Empleado();
$empleados->set_id($_POST['id']);

$resultado = $empleados->eliminaEmpleado();

if ($resultado->error != null) {
    $mensajeError = explode("Error: ", $resultado->getErrorDetail());
    $mensajeError = $mensajeError[1];
    echo json_encode(["error" => true, "mensaje" => $mensajeError]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Empleado eliminado exitosamente"]);
}
