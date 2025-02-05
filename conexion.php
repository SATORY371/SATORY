<?php
class Conexion {
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "aerolinea";
    private $port = 3307;
    public $conn;

    public function __construct() {
        // Crear conexión con puerto
        $this->conn = new mysqli($this->servername, $this->username, 
                                 $this->password, $this->dbname, $this->port);
        
        // Verificar conexión
        if ($this->conn->connect_error) {
            die("Error de conexión: " . $this->conn->connect_error);
        }
        
        // Establecer codificación UTF-8 para manejar caracteres especiales
        $this->conn->set_charset("utf8");
    }

    public function obtenerVuelos() {
        $query = "SELECT * FROM vuelos";
        $result = $this->conn->query($query);
        return $result;
    }

    public function __destruct() {
        // Cerrar conexión automáticamente
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>