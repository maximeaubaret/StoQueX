<?php
include ("../db.php");

// 'symbol'
if (isset($_GET['symbol'])) {
  $symbol = $_GET['symbol'];
}

if (isset($symbol)) {
  $stmt = $db->prepare("SELECT * FROM Symbols AS s JOIN (SELECT DATE AS 'last_trade', OPEN AS 'last_open', high AS 'last_high', low AS 'last_low', CLOSE AS 'last_close', volume AS 'last_volume' FROM Quotes WHERE symbol = :symbol ORDER BY DATE DESC LIMIT 1) AS q WHERE s.symbol = :symbol;"); 
  $stmt->bindParam(':symbol', $symbol);
}
else {
  $stmt = $db->prepare('SELECT * FROM Symbols AS s JOIN (SELECT symbol FROM Quotes GROUP BY symbol) AS q ON s.symbol = q.symbol');
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
