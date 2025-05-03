<?php
//ini_set("display_errors", 1);
require_once "../empleados/Empleado.php";
$campos_obligatorios = ["id", "nombre", "apellidoPaterno", "apellidoMaterno", "edad", "correo", "departamento"];
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
$empleados->set_id($_POST['id']);
$empleados->set_nombre($_POST['nombre']);
$empleados->set_apellidoPaterno($_POST['apellidoPaterno']);
$empleados->set_apellidoMaterno($_POST['apellidoMaterno']);
$empleados->set_edad($_POST['edad']);
$empleados->set_correo($_POST['correo']);
$empleados->set_telefono($_POST['telefono']);
$empleados->set_departamento($_POST['departamento']);

$resultado = $empleados->actualizaEmpleado();
if ($resultado->error != null) {
    echo json_encode(["error" => true, "mensaje" => $resultado->errorDetail]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Empleado guardado exitosamente"]);
}
