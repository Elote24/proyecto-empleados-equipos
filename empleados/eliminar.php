<?php
//ini_set("display_errors", 1);
require_once "../empleados/Empleado.php";
$empleados = new Empleado();
$empleados->set_id($_POST['id']);

$resultado = $empleados->eliminaEmpleado();

if ($resultado->error != null) {
    echo json_encode(["error" => true, "mensaje" => $resultado->errorDetail]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Empleado eliminado exitosamente"]);
}
