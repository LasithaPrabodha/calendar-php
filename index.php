<?php

define('ROOT', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'calendar' . DIRECTORY_SEPARATOR);
define('VIEW', ROOT . 'view' . DIRECTORY_SEPARATOR);
define('MODEL', ROOT . 'model' . DIRECTORY_SEPARATOR);
define('CORE', ROOT . 'core' . DIRECTORY_SEPARATOR);
define('CONTROLLER', ROOT . 'controller' . DIRECTORY_SEPARATOR);

define("DB_HOST", "localhost");
define("DB_USERNAME", "root");
define("DB_PASSWORD", "");
define("DB_DATABASE", "ABC");

$modules = [ROOT, CORE, CONTROLLER];

set_include_path(get_include_path() . PATH_SEPARATOR . implode(PATH_SEPARATOR, $modules));
spl_autoload_register('spl_autoload', false);

new Application();
