<?php
//ini_set("display_errors", 1);
require_once("../equipos/equipo.php");

$equipos = new Equipo(); 
$equipos = $equipos->consultarEquipos(); 
if ($equipos) {
    echo json_encode( $equipos );
} else {
    echo "No se encontraron empleados.";
}