<?php
require_once('../vendor/autoload.php'); // Cargar las dependencias de Composer

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

class conexion {
    //BASE DE DATOS SQL 
    protected $hostname ;
    protected $port ;
    protected $dbname ;
    protected $username ;
    protected $pw ;
    function __construct(){  
    $this->hostname =  $_ENV['DB_HOST'];
    $this->port =  $_ENV['DB_PORT'];
    $this->dbname = $_ENV['DB_NAME'];
    $this->username = $_ENV['DB_USER'];
    $this->pw = $_ENV['DB_PASS'];
    }



    public $data = null;
    public $error = false;

    // Set & Get $error
    public function getData(){ return $this->data; }
    public function getError(){ return $this->error; }

    protected $errorDetail = false;
    public function getErrorDetail(){ return $this->errorDetail; }

    protected $sql= '';
    public function getSQL(){ return $this->sql; }

    private function connect()
    {
        try
        {
            $this->connection = new PDO("sqlsrv:Server=$this->hostname,$this->port;Database=$this->dbname", "$this->username", "$this->pw");
            $this->error = isset($this->connection->connect_error);
            if( $this->error ){
                $this->error = "Error al intentar conectar con la base de datos ";
                $this->errorDetail = $this->connection->connect_error;
            }
        }
        catch (PDOException $e)
        {
            echo "error".$this->hostname;

            //$this->logsys .= "Failed to get DB handle: " . $e->getMessage() . "\n";
        }

    }

 

    public function execute($fnc, $args, $fetch = true) {
        $this->error = false;
        $this->connect(); 
    
        if ($this->error) { return false; } // Si hubo error en la conexión, salir
    
        $this->sql = "$fnc " . implode(',', $args);
    
        try {
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $preparedCall = $this->connection->prepare($this->sql);
            $preparedCall->execute();
    
            if (!$fetch && $preparedCall->rowCount() === 0) {
                return false; 
            }
    
            if ($fetch && $preparedCall->columnCount() > 0) {
                $this->data = $preparedCall->fetchAll();
                return $this->data; 
            }
    
            return true; 
    
        } catch (Exception $ex) {
            $this->error = " Error en la base de datos";
            $this->errorDetail = $ex->getMessage();
            error_log("Error SQL: " . $ex->getMessage()); // Guardar el error en el log
            return false; 
        }
    }
    

    
}
?>
