<?php

require_once("../db/conexion.php");

class Equipo {
    private $id;
    private $nombre;
    private $tipo;
    private $numeroSerie;
    private $empleado;

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

    function set_tipo($val)
	{ $this->tipo = $val; }

    function set_numeroSerie($val)
	{ $this->numeroSerie = $val; }

    function set_empleado($val)
	{ $this->empleado = $val; }



    public function consultarEquipos(){
        $parametros = array();
        $procedimiento = 'proc_ObtenerEquipos';

        return $this->sql($procedimiento, $parametros);
    }

    public function guardarEquipo(){
        $parametros = array("'".$this->nombre."'","'".$this->tipo."'","'".$this->numeroSerie."'");
        $procedimiento = 'proc_insertarEquipo';
        return $this->sql($procedimiento, $parametros);
    }

    public function actualizaEquipo(){
        $parametros = array($this->id,"'".$this->nombre."'","'".$this->tipo."'");
        $procedimiento = 'proc_ActualizarEquipo';
        return $this->sql($procedimiento, $parametros);
    }


    public function eliminaEquipo(){
        $parametros = array($this->id);
        $procedimiento = 'proc_eliminarEquipo';
        return $this->sql($procedimiento, $parametros);
    }

    public function asignarEquipo(){
        $parametros = array($this->id,$this->empleado);
        $procedimiento = 'proc_AsignarEquipo';
       
        return $this->sql($procedimiento, $parametros);
    }





}
