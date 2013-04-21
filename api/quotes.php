<?php
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

if (isset($date) && $date == "lasts") {
  $stmt = $db->prepare('SELECT * FROM Quotes WHERE Symbol = :symbol ORDER BY Date DESC LIMIT 60');
}
elseif (isset($date)) {
  $stmt = $db->prepare('SELECT * FROM Quotes WHERE Symbol = :symbol and Date = :date ORDER BY Date');
  $stmt->bindParam(':date', $date);
}
elseif (isset($from) && isset($to)) {
  $stmt = $db->prepare('SELECT * FROM Quotes WHERE Symbol = :symbol and Date >= :from && Date <= :to ORDER BY Date');
  $stmt->bindParam(':from', $from);
  $stmt->bindParam(':to', $to);
}
else {
  $stmt = $db->prepare('SELECT * FROM Quotes WHERE Symbol = :symbol ORDER BY Date');
}


$stmt->bindParam(':symbol', $symbol);

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
