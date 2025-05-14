
<?php


require_once("../empleados/Empleado.php");

$empleados = new Empleado(); 
$empleados = $empleados->consultarDepartamentos(); 
if ($empleados) {
    echo json_encode($empleados);
} else {
    echo json_encode(["error" => "No se encontraron departamentos"]);
}