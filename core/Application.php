<?php

class Application
{
    protected $controller = 'homeController';
    protected $action = 'index';
    protected $params = [];

    public function __construct()
    {
        $this->prepareURL();
        if (file_exists(CONTROLLER . $this->controller . '.php')) {
            $this->controller = new $this->controller;

            if (method_exists($this->controller, $this->action)) {
                call_user_func_array([$this->controller, $this->action], $this->params);
            } else {
                http_response_code(404);
            }
        } else {
            http_response_code(404);
        }
    }

    protected function prepareURL()
    {
        $request = rtrim($_SERVER['REQUEST_URI'], '/');

        if (!empty($request)) {
            $request = explode('?', $request);
            $url = array_slice(explode('/', $request[0]), 3);

            $this->controller = isset($url[0]) ? ucfirst($url[0]) . 'Controller' : 'EventsController';
            $this->action = isset($url[1]) ? $url[1] : 'index';

            unset($url[0], $url[1]);

            $this->params = !empty($url) ? array_values($url) : [];
        }
    }
}
