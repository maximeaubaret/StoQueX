<?php
mysql_connect ("localhost", "root", "root");
mysql_select_db ("pg217");
$sql = "SELECT * FROM Quotes WHERE Symbol = '" . $_GET['symbol'] . "' LIMIT 0, 50";
$result = mysql_query ($sql);
echo '{ "data":[';
$i = 0;
$n = mysql_num_rows ($result);
while ($row = mysql_fetch_array($result)) {
  echo '{';
  echo '"symbol":"' . $row['Symbol'] . '",';
  echo '"date":"' . $row['Date'] . '",';
  echo '"open":"' . $row['Open'] . '",';
  echo '"high":"' . $row['High'] . '",';
  echo '"low":"' . $row['Low'] . '",';
  echo '"close":"' . $row['Close'] . '",';
  echo '"volume":"' . $row['Volume'] . '"';
  echo "}";

  if (!($i == $n - 1)) {
    echo ",";
  }
  $i++;
}
echo "]}";
?>
