<?php
include ("../db.php");

// 'symbol'
if (isset($_GET['symbol'])) {
  $symbol = $_GET['symbol'];
}

if (isset($symbol)) {
  $stmt = $db->prepare('SELECT * FROM Symbols WHERE symbol = :symbol ORDER BY symbol');
  $stmt->bindParam(':symbol', $symbol);
}
else {
  $stmt = $db->prepare('SELECT * FROM Symbols ORDER BY symbol');
}

try {
  $stmt->execute();

  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode ($rows);
}
catch (PDOException $exception) {
  $r['status'] = '500';

  echo json_encode ($r);
}
?>
