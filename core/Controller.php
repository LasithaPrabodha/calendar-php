<?php

class Controller
{
    protected $model;
    protected $view;
    protected $input;
    protected $session;

    
    public function __construct()
    {
        $this->input = new Input();
        $this->session = new Session();
    }

    public function view($viewName, $data = [])
    {
        $this->view = new View($viewName, $data);
        return $this->view;
    }
    
    public function model($modelName, $data = [])
    {
        $name = ucfirst($modelName);
        if (file_exists(MODEL . $name . '.php')) {
            require MODEL . $name . '.php';
            $this->model = new $name;
        }
    }

    public function send($status, $response)
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
}
