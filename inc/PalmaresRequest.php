<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

class PalmaresRequest extends Request {
  protected function routes () {
    return array (
      'palmaresOnDate' => array ('date')
    );
  }

  function palmaresOnDate () {
    $sql1 = '
      SELECT 
        symbol,
        close,
        (((close / open) - 1) * 100) as perf
      FROM quotes
      WHERE date = :date
      ORDER BY perf DESC
      LIMIT 15
    ';

    $sql2 = '
      SELECT 
        symbol,
        close,
        (((close / open) - 1) * 100) as perf
      FROM quotes
      WHERE date = :date
      ORDER BY perf ASC 
      LIMIT 15
    ';

    $sql3 = '
      SELECT 
        symbol,
        close,
        (((close / open) - 1) * 100) as perf,
        volume
      FROM quotes
      WHERE date = :date
      ORDER BY volume DESC 
      LIMIT 15
    ';

    $result1 = parent::_executeSQLQuery ($sql1, array(
      ':date' => $this->parameters['date']
    ));

    $result2 = parent::_executeSQLQuery ($sql2, array(
      ':date' => $this->parameters['date']
    ));

    $result3 = parent::_executeSQLQuery ($sql3, array(
      ':date' => $this->parameters['date']
    ));

    $this->results = array (
      "green" => $result1,
      "red" => $result2,
      "volume" => $result3
    );
  }
}
?>

