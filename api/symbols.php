<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

include ("../db.php");

// 'symbol'
if (isset($_GET['symbol'])) {
  $symbol = $_GET['symbol'];
}

if (isset($symbol)) {
  $stmt = $db->prepare('
    SELECT 
      s.symbol, 
      s.place, 
      s.company, 
      s.sector, 
      q.open "last_open", 
      q.high "last_high", 
      q.low "last_low", 
      q.close "last_close", 
      q.volume "last_volume" 
    FROM symbols s 
    JOIN quotes q ON s.symbol = q.symbol WHERE s.symbol = :symbol 
    ORDER BY q.date DESC 
    LIMIT 1;
  ');
  $stmt->bindParam(':symbol', $symbol);
}
else {
  $stmt = $db->prepare('SELECT * FROM symbols AS s JOIN (SELECT symbol FROM quotes GROUP BY symbol) AS q ON s.symbol = q.symbol');
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
