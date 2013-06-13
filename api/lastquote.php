<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

include ("../db.php");

$req = "
  SELECT *
  FROM quotes
  ORDER BY date DESC
  LIMIT 1
";

$stmt = $db->prepare($req);
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode ($data);
?>

