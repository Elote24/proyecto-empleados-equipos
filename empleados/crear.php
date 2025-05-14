<?php
//ini_set("display_errors", 1);
require_once "../empleados/Empleado.php";
$campos_obligatorios = ["nombre", "apellidoPaterno", "apellidoMaterno", "edad", "correo", "departamento"];
$errores = [];

foreach ($campos_obligatorios as $campo) {
    if (empty($_POST[$campo])) {
        $errores[] = "El campo $campo es obligatorio.";
    }
}

if (!empty($errores)) {
    echo json_encode(["error" => true, "mensaje" => $errores]);
    exit;
}

$empleados = new Empleado();
$empleados->set_nombre($_POST['nombre']);
$empleados->set_apellidoPaterno($_POST['apellidoPaterno']);
$empleados->set_apellidoMaterno($_POST['apellidoMaterno']);
$empleados->set_edad($_POST['edad']);
$empleados->set_correo($_POST['correo']);
$empleados->set_telefono($_POST['telefono']);
$empleados->set_departamento($_POST['departamento']);

$resultado = $empleados->guardarEmpleado();

if ($resultado->error != null) {
    $mensajeError = explode("Error: ", $resultado->getErrorDetail());
    $mensajeError = $mensajeError[1];
    echo json_encode(["error" => true, "mensaje" => $mensajeError]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Empleado guardado exitosamente"]);
}
