<?php
require_once("../equipos/equipo.php");
$campos_obligatorios = ["id", "empleado"];
$errores = [];

foreach ($campos_obligatorios as $campo) {
    if (empty($_POST[$campo]||$_POST[$campo]==null)) {
        $errores[] = "El campo $campo es obligatorio.";
    }
}

if (!empty($errores)) {
    echo json_encode(["error" => true, "mensaje" => $errores]);
    exit;
}

$equipo = new Equipo(); 
$equipo->set_id($_POST['id']);
$equipo->set_empleado($_POST['empleado']);




$resultado = $equipo->asignarEquipo(); 
if ($resultado->error != null) {
    $mensajeError = explode("Error: ", $resultado->getErrorDetail());
    $mensajeError = $mensajeError[1];
    echo json_encode(["error" => true, "mensaje" => $mensajeError]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Equipo asignado exitosamente"]);
}