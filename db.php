<?php
$database['dsn']        = "mysql:host=localhost;dbname=pg217;charset=utf8";
$database['user']       = "root";
$database['password']   = "root";

if (isset($_ENV["DATABASE_DSN"])) {
  $database['dsn'] = $_ENV["DATABASE_DSN"];
}

try {
  if (isset($_ENV["DATABASE_DSN"]))
    $db = new PDO($_ENV["DATABASE_DSN"]);

  else
    $db = new PDO($database['dsn'], $database['user'], $database['password']);
}
catch (PDOException $e) {
  die ("Unable to access DB");
}
?>
