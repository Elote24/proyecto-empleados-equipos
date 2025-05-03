<?php
//ini_set("display_errors", 1);
require_once("../equipos/equipo.php");
$equipo = new Equipo(); 
$equipo->set_id($_POST['id']);

$resultado = $equipo->eliminaEquipo(); 


if ($resultado->error!=null) {
    echo json_encode(["error" => true, "mensaje" => $resultado->errorDetail]);
} else {
    echo json_encode(["error" => false, "mensaje" => "Empleado eliminado exitosamente"]);
}