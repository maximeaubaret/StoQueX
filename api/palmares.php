<?php
include ("../db.php");


function green($date) {
  global $db;

  $req = "
    SELECT 
    symbol,
    close,
    (((close / open) - 1) * 100) as perf

    FROM quotes
    WHERE date = :date
    ORDER BY perf DESC
    LIMIT 5
    ";

  $stmt = $db->prepare($req);
  $stmt->bindParam(':date', $date);
  $stmt->execute();

  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function red($date) {
  global $db;

  $req = "
    SELECT 
    symbol,
    close,
    (((close / open) - 1) * 100) as perf

    FROM quotes
    WHERE date = :date
    ORDER BY perf ASC 
    LIMIT 5
    ";

  $stmt = $db->prepare($req);
  $stmt->bindParam(':date', $date);
  $stmt->execute();

  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function volume($date) {
  global $db;

  $req = "
    SELECT 
    symbol,
    close,
    (((close / open) - 1) * 100) as perf,
    volume

    FROM quotes
    WHERE date = :date
    ORDER BY volume DESC 
    LIMIT 5
    ";

  $stmt = $db->prepare($req);
  $stmt->bindParam(':date', $date);
  $stmt->execute();

  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


$date = $_GET['date'];

$result = array(
  'green' => green($date),
  'red' => red($date),
  'volume' => volume($date)
);

echo json_encode ($result);
?>
