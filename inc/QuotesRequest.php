<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

class QuotesRequest extends Request {
  protected function routes () {
    return array (
      'quotesWithSymbol' => array ('symbol'),
      'quotesWithSymbolOnADate' => array ('symbol', 'date'),
      'quotesWithSymbolOnADateRange' => array ('symbol', 'from', 'to'),
      'lastQuotesWithSymbol' => array ('symbol', 'lasts'),
      'averageQuotesWithSymbol' => array ('symbol', 'average'),
      'firstLastCompanyWithSymbolOnADateRange' => array ('symbol', 'from', 'to', 'firstlast'),
      'sp500OnADateRange' => array ('from', 'to', 'sp500'),
      'lastQuote' => array ('lastquote')
    );
  }

  function quotesWithSymbol () {
    $sql = '
      SELECT *
      FROM quotes
      WHERE symbol = :symbol
      ORDER BY date;
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':symbol' => $this->parameters['symbol']
    ));
  }

  function quotesWithSymbolOnADate () {
    $sql = '
      SELECT *
      FROM quotes
      WHERE symbol = :symbol AND date = :date;
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':symbol' => $this->parameters['symbol'],
      ':date' => $this->parameters['date']
    ));
  }

  function quotesWithSymbolOnADateRange () {
    $sql = '
      SELECT *
      FROM quotes
      WHERE 
        symbol = :symbol AND
        date BETWEEN :from AND :to
      ORDER BY date;
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':symbol' => $this->parameters['symbol'],
      ':from' => $this->parameters['from'],
      ':to' => $this->parameters['to']
    ));
  }

  function averageQuotesWithSymbol() {
    $sql = '
      SELECT 
        symbol, 
        EXTRACT(MONTH FROM date) AS month, 
        EXTRACT(YEAR FROM date) AS year, 
        avg(open) "average_open", 
        avg(high) "average_high", 
        avg(low) "average_low", 
        avg(CLOSE) "average_close", 
        avg(volume) "average_volume" 
      FROM quotes 
      WHERE symbol = :symbol 
      GROUP BY YEAR, MONTH, symbol 
      ORDER BY YEAR, MONTH;
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':symbol' => $this->parameters['symbol']
    ));
  }

  function lastQuotesWithSymbol() {
    $sql = '
      SELECT * 
      FROM quotes 
      WHERE symbol = :symbol 
      ORDER BY date DESC 
      LIMIT 60
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':symbol' => $this->parameters['symbol']
    ));
  }

  function firstLastCompanyWithSymbolOnADateRange () {
    $sql1 = '
      SELECT COUNT(1) AS first 
      FROM quotes AS A 
      JOIN (
        SELECT DATE, MAX(CLOSE) AS CLOSE 
        FROM quotes GROUP BY DATE
      ) AS B ON A.date = B.date AND A.close = B.close 
      WHERE symbol=:symbol AND A.date BETWEEN :from AND :to
    ';

    $sql2 = '
      SELECT COUNT(1) AS last 
      FROM quotes AS A 
      JOIN (
        SELECT DATE, MIN(CLOSE) AS CLOSE 
        FROM quotes 
        GROUP BY DATE
      ) AS B ON A.date = B.date AND A.close = B.close 
      WHERE symbol=:symbol AND A.date BETWEEN :from AND :to
    ';

    $result1 = parent::_executeSQLQuery ($sql1, array(
      ':symbol' => $this->parameters['symbol'],
      ':from' => $this->parameters['from'],
      ':to' => $this->parameters['to']
    ));

    $result2 = parent::_executeSQLQuery ($sql2, array(
      ':symbol' => $this->parameters['symbol'],
      ':from' => $this->parameters['from'],
      ':to' => $this->parameters['to']
    ));

    $this->results = array (
      "first" => $result1[0]['first'],
      "last" => $result2[0]['last']
    );
  }

  function sp500OnADateRange () {
    $sql = '
      SELECT 
        date, 
        avg(close) AS close, 
        avg(volume) AS volume
      FROM quotes 
      WHERE date BETWEEN :from AND :to
      GROUP BY date ORDER BY date ASC
    ';

    $this->results = parent::_executeSQLQuery ($sql, array(
      ':from' => $this->parameters['from'],
      ':to' => $this->parameters['to']
    ));
  }

  function lastQuote() {
    $sql = '
      SELECT *
      FROM quotes
      ORDER BY date DESC
      LIMIT 1
    ';

    $this->results = parent::_executeSQLQuery ($sql, array());
  }
}
?>

