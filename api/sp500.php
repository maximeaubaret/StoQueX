<?php
include ("../db.php");

$from = $_GET['from'];
$to = $_GET['to'];

$req = "
  SELECT date, avg(close) AS close, avg(volume) AS volume
  FROM quotes 
  WHERE date BETWEEN :from AND :to
  GROUP BY date ORDER BY date ASC
";

$stmt = $db->prepare($req);
$stmt->bindParam(':from', $from);
$stmt->bindParam(':to', $to);
$stmt->execute();


$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode ($data);
?>
