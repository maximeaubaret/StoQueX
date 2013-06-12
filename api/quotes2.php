<?php
include ("../db.php");

$symbol = $_GET['symbol'];
$from = $_GET['from'];
$to = $_GET['to'];

$stmt1 = $db->prepare('SELECT COUNT(1) AS first FROM quotes AS A JOIN (SELECT DATE, MAX(CLOSE) AS CLOSE FROM quotes GROUP BY DATE) AS B ON A.date = B.date AND A.close = B.close WHERE symbol=:symbol AND A.date BETWEEN :from AND :to');
$stmt1->bindParam(':symbol', $symbol);
$stmt1->bindParam(':from', $from);
$stmt1->bindParam(':to', $to);
$stmt1->execute();

$stmt2 = $db->prepare('SELECT COUNT(1) AS last FROM quotes AS A JOIN (SELECT DATE, MIN(CLOSE) AS CLOSE FROM quotes GROUP BY DATE) AS B ON A.date = B.date AND A.close = B.close WHERE symbol=:symbol AND A.date BETWEEN :from AND :to');
$stmt2->bindParam(':symbol', $symbol);
$stmt2->bindParam(':from', $from);
$stmt2->bindParam(':to', $to);
$stmt2->execute();

$first = $stmt1->fetchAll(PDO::FETCH_ASSOC);
$last = $stmt2->fetchAll(PDO::FETCH_ASSOC);

$data = array (
  "first" => $first[0]['first'],
  "last" => $last[0]['last']
);

echo json_encode ($data);
?>
