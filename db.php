<?php
$database['dsn']        = "mysql:host=localhost;dbname=pg217;charset=utf8";
$database['user']       = "root";
$database['password']   = "root";

if (isset($_ENV["DATABASE_DSN"]))
  $database['server'] = $_ENV["DATABASE_DSN"];

if (isset($_ENV["DATABASE_USER"]))
  $database['server'] = $_ENV["DATABASE_USER"];

if (isset($_ENV["DATABASE_PASSWORD"]))
  $database['server'] = $_ENV["DATABASE_PASSWORD"];

try {
  $db = new PDO($database['dsn'], $database['user'], $database['password']);
}
catch (PDOException $e) {
  die ("Unable to access DB");
}
?>
