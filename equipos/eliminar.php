<?php
//ini_set("display_errors", 1);
require_once("../equipos/equipo.php");
$equipo = new Equipo(); 
$equipo->set_id($_POST['id']);

$resultado = $equipo->eliminaEquipo(); 


if ($resultado->error != null) {
    $mensajeError = explode("Error: ", $resultado->getErrorDetail());
    $mensajeError = $mensajeError[1];
    echo json_encode(["error" => true, "mensaje" => $mensajeError]);
}else {
    echo json_encode(["error" => false, "mensaje" => "equipo eliminado exitosamente"]);
}