<?php
//ini_set("display_errors", 1);
require_once "../equipos/equipo.php";
$campos_obligatorios = ["id", "nombre", "tipo"];
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

$equipo = new Equipo();
$equipo->set_id($_POST['id']);
$equipo->set_nombre($_POST['nombre']);
$equipo->set_tipo($_POST['tipo']);

$resultado = $equipo->actualizaEquipo();
if ($resultado->error != null) {
    echo json_encode(["error" => true, "mensaje" => $resultado->errorDetail]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Equipo guardado exitosamente"]);
}
