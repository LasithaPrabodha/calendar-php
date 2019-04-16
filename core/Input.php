<?php

class Input
{
    private function fetch_from_array(&$array, $index = null)
    {
        // If $index is NULL, it means that the whole $array is requested
        isset($index) or $index = array_keys($array);

        // allow fetching multiple keys at once
        if (is_array($index)) {
            $output = array();
            foreach ($index as $key) {
                $output[$key] = $this->fetch_from_array($array, $key);
            }
            return $output;
        }

        if (isset($array[$index])) {
            $value = $array[$index];
        } else {
            return null;
        }
        return $value;
    }
    public function get($index = null)
    {
        return $this->fetch_from_array($_GET, $index);
    }

    public function post($index = null)
    {
        return $this->fetch_from_array($_POST, $index);
    }
}
