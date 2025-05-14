
<?php


require_once("../empleados/Empleado.php");

$empleados = new Empleado(); 
$empleados = $empleados->consultarEmpleados(); 


if (!empty($empleados) && is_array($empleados)) {
    echo json_encode($empleados);
} else {
    echo json_encode(["error" => "No se encontraron empleados"]);
}
