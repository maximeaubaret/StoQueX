<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

// api.php?symbol=AAPL
// -
// Return all the quotes for the symbol 'AAPL'
//
// api.php?symbol=AAPL&date=2000-03-01
// -
// Returns all the quotes for the symbol 'AAPL' on 2000-03-01
//
// api.php?symbol=AAPL&from=2000-03-01&to=2000-03-10
// -
// Returns all the quotes for the symbol 'AAPL' between 2000-03-01 and 2000-03-10

include ("../db.php");


// 'symbol'
//
// Call to this API requires a symbol parameter.
if (empty($_GET['symbol'])) {
  die ("'symbol' required\n");
}
else {
  $symbol = $_GET['symbol'];
}


// 'date'
//
// If 'date' is set, fetch all quotes from a symbol for a day.
if (isset($_GET['date'])) {
  $date = $_GET['date'];
}


// 'from' and 'to'
//
// If 'from' and 'to' are both set, fetch all quotes for a symbol
// in a particular window of time.
if (isset($_GET['from']) && isset($_GET['to'])) {
  $from = $_GET['from'];
  $to = $_GET['to'];
}

// Prepare SQL Statement

if (isset($_GET['average'])) {
  $stmt = $db->prepare('SELECT symbol, EXTRACT(MONTH FROM date) AS month, EXTRACT(YEAR FROM date) AS year, avg(open) "average_open", avg(high) "average_high", avg(low) "average_low", avg(CLOSE) "average_close", avg(volume) "average_volume" FROM quotes WHERE symbol = :symbol GROUP BY YEAR, MONTH, symbol ORDER BY YEAR, MONTH;');
}
elseif (isset($date) && $date == "lasts") {
  $stmt = $db->prepare('SELECT * FROM quotes WHERE symbol = :symbol ORDER BY date DESC LIMIT 60');
}
elseif (isset($date)) {
  $stmt = $db->prepare('SELECT * FROM quotes WHERE symbol = :symbol and date = :date ORDER BY date');
  $stmt->bindParam(':date', $date);
}
elseif (isset($from) && isset($to)) {
  $stmt = $db->prepare('SELECT * FROM quotes WHERE symbol = :symbol and date >= :from and date <= :to ORDER BY date');
  $stmt->bindParam(':from', $from);
  $stmt->bindParam(':to', $to);
}
else {
  $stmt = $db->prepare('SELECT * FROM quotes WHERE symbol = :symbol ORDER BY date');
}

try {
  $stmt->bindParam(':symbol', $symbol);
  $stmt->execute();

  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode ($rows);
}
catch (PDOException $exception) {
  $r['status'] = '500';

  echo json_encode ($r);
}
?>
