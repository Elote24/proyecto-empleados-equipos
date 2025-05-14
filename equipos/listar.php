<?php
//ini_set("display_errors", 1);
require_once("../equipos/equipo.php");

$equipos = new Equipo(); 
$equipos = $equipos->consultarEquipos(); 

if (!empty($equipos) && is_array($equipos)) {
    echo json_encode($equipos);
} else {
    echo json_encode(["error" => "No se encontraron equipos"]);
}