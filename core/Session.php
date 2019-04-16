<?php

class Session
{
    public function __construct()
    {
        session_start();
    }

    public function set($key, $value)
    {
        $_SESSION[$key] = $value;
    }

    public function get($key)
    {
        if (isset($_SESSION[$key])) {
            return $_SESSION[$key];
        }
        return null;
    }

    public function isEmpty()
    {
        return empty($_SESSION);
    }
    public function isset($key)
    {
        return isset($_SESSION[$key]);
    }

    public function sess_destroy()
    {
        session_destroy();
    }
}
