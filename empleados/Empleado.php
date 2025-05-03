<?php

require_once("../db/conexion.php");

class Empleado {
    private $id;
    private $nombre;
    private $apellidoPaterno;
    private $apellidoMaterno;
    private $edad;
    private $correo;
    private $telefono;
    private $departamento;

    public function __construct() {}

    private function sql($funcion, $parametros){
        $obj = new conexion();
        $obj->execute($funcion, $parametros);
        if( $obj->error ){ return $obj; }
        return $obj->data;
    }

    function set_id($val)
	{ $this->id = $val; }

    function set_nombre($val)
	{ $this->nombre = $val; }

    function set_apellidoPaterno($val)
	{ $this->apellidoPaterno = $val; }

    function set_apellidoMaterno($val)
	{ $this->apellidoMaterno = $val; }

    function set_edad($val)
	{ $this->edad = $val; }

    function set_correo($val)
	{ $this->correo = $val; }

    function set_telefono($val)
	{ $this->telefono = $val; }

    function set_departamento($val)
	{ $this->departamento = $val; }


    public function consultarEmpleados(){
        $parametros = array();
        $procedimiento = 'proc_ObtenerEmpleados';

        return $this->sql($procedimiento, $parametros);
    }

    public function guardarEmpleado(){
        $parametros = array("'".$this->nombre."'","'".$this->apellidoPaterno."'","'".$this->apellidoMaterno."'",$this->edad,"'".$this->correo."'",$this->telefono,$this->departamento);
        $procedimiento = 'proc_InsertarEmpleado';
        return $this->sql($procedimiento, $parametros);
    }

    public function actualizaEmpleado(){
        $parametros = array($this->id,"'".$this->nombre."'","'".$this->apellidoPaterno."'","'".$this->apellidoMaterno."'",$this->edad,"'".$this->correo."'",$this->telefono,$this->departamento);
        $procedimiento = 'proc_ActualizarEmpleado';
        return $this->sql($procedimiento, $parametros);
    }


    public function eliminaEmpleado(){
        $parametros = array($this->id);
        $procedimiento = 'proc_eliminarEmpleado';
        return $this->sql($procedimiento, $parametros);
    }

    public function consultarDepartamentos(){
        $parametros = array();
        $procedimiento = 'proc_ObtenerDepartamentos';

        return $this->sql($procedimiento, $parametros);
    }




}
