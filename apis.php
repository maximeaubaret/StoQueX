<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */
/*
 * apis.php?q=<request>&[params]
 */

define ('PATH', '.');
require_once (PATH . '/inc/Request.php');
require_once (PATH . '/inc/QuotesRequest.php');
require_once (PATH . '/inc/PalmaresRequest.php');
require_once (PATH . '/inc/SymbolsRequest.php');

/* Setting database with environnment config or with default values */
$database['dsn'] = isset ($_ENV['DATABASE_DSN']) ? $database['dsn'] : "mysql:host=localhost;dbname=pg217;charset=utf8;";
$database['uid'] = isset ($_ENV['DATABASE_UID']) ? $database['uid'] : "root";
$database['pwd'] = isset ($_ENV['DATABASE_PWD']) ? $database['pwd'] : "root";

/* Setting up database */
try {
  if (!strncmp($database['dsn'], "mysql:", 6)) {
    $db = new PDO ($database['dsn'], $database['uid'], $database['pwd']);
  }
  else {
    $db = new PDO ($database['dsn']);
  }
}
catch (PDOException $e) {
  die ("Unable to access DB");
}

/* Building the request */
$requestName = "";
$requestParameters = array();
foreach ($_GET as $key => $value) {
  if ($key == 'q')
    $requestName = ucfirst ($value) . "Request";
  else
    $requestParameters[$key] = $value;
}

if (class_exists ($requestName)) {
  $request = new $requestName;
  $request->setParameters ($requestParameters);
  $request->execute ();

  echo $request->getResults();
}
else {
  die (json_encode (array ('error' => 'Invalid request')));
}
?>
