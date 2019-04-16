<?php
class Database
{

    protected $db;
    private $host, $username, $password, $database;

    /**
     * Creates the mysql connection.
     * Kills the script on connection or database errors.
     * 
     * @return boolean
     */
    public function __construct()
    {
        $this->host        = DB_HOST;
        $this->username    = DB_USERNAME;
        $this->password    = DB_PASSWORD;
        $this->database    = DB_DATABASE;

        $this->db = new mysqli($this->host, $this->username, $this->password)
            or die("There was a problem connecting to the database.");

        /* check connection */
        if (mysqli_connect_errno()) {
            printf("Connect failed: %s\n", mysqli_connect_error());
            exit();
        }

        $this->db->select_db($this->database);

        if (mysqli_connect_errno()) {
            printf("Connect failed: %s\n", mysqli_connect_error());
            exit();
        }

        return true;
    }

    /**
     * Automatically closes the mysql connection
     * at the end of the program.
     */
    public function __destruct()
    {
        $this->db->close()
            or die("There was a problem disconnecting from the database.");
    }
}
