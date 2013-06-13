<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

class SymbolsRequest extends Request {
  protected function routes () {
    return array (
      'symbolWithSymbol' => array ('symbol'),
      'symbols' => array()
    );
  }

  function symbolWithSymbol () {
    $sql = '
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
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':symbol' => $this->parameters['symbol']
    ));
  }

  function symbols () {
    $sql = '
      SELECT * 
      FROM symbols AS s 
      JOIN (
        SELECT symbol 
        FROM quotes 
        GROUP BY symbol
      ) AS q ON s.symbol = q.symbol
    ';

    $this->results = parent::_executeSQLQuery ($sql, array());
  }
}
?>

