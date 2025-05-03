
<?php


require_once("../empleados/Empleado.php");

$empleados = new Empleado(); 
$empleados = $empleados->consultarEmpleados(); 
if ($empleados) {
    echo json_encode( $empleados );
} else {
    echo "No se encontraron empleados.";
}
