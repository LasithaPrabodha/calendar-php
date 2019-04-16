<?php

class View
{
    protected $view_file;
    protected $view_data;

    public function __construct($view_file, $view_data)
    {
        $this->view_file = $view_file;
        $this->view_data = $view_data;
        $this->render();
    }

    public function render()
    {
        if (file_exists(VIEW . ucfirst($this->view_file) . '.phtml')) {
            include(VIEW . ucfirst($this->view_file) . '.phtml');
        }
    }
}
