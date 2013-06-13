<?php
/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

/**
 * #Request
 *
 * Abstract class representing the request made
 * by the user. Each child of #Request *must* implement
 * the route() method and save the result of the request
 * inside the $results attribute.
 *
 * A #Request has a set of parameters as an array which
 * is defined by calling setParameters().
 *
 * To execute a #Request, use execute(). To access the 
 * result of the resquest, use getResults().
 */
abstract class Request {
  protected $parameters;
  protected $results;

  /**
   * routes
   *
   * Returns the list of requirements for each
   * route
   *
   * Must be implemented by children.
   *
   * Return: an array containing the parameters needed
   * for each route
   *
   * Example of return value: array (
   *   'symbols' => array(), 
   *   'company' => array('symbol')
   * )
   */
  abstract protected function routes ();

  /**
   * routes
   *
   * Used to route the request internally to the correct
   * method.
   */
  final private function route () {
    $routes = $this->routes();
    $finalRoute = "";

    /* Sorting routes by number of parameters */
    $routes2 = array();
    foreach ($routes as $key => $value) {
      array_push ($routes2, array ($key, $value));
    }
    function cmp ($a, $b) {
      if (count($a[1]) > count($b[1]))
        return -1;

      if (count($a[1]) == count($b[1]))
        return 0;

      return 1;
    }
    usort ($routes2, "cmp");
    $routes = $routes2;

    /* Testing each route for a valid one */
    foreach ($routes as $route) {
      $neededParams = $route[1];
      $passed = count($neededParams);

      foreach ($neededParams as $key) {
        if (isset ($this->parameters[$key]))
          $passed--;
      }

      if ($passed == 0) {
        $finalRoute = $route[0];
        break;
      }
    }

    if ($finalRoute != "") 
      if (method_exists ($this, $finalRoute))
        $this->$finalRoute();
  }

  /**
   * execute
   *
   * Executes the #Request.
   */
  final function execute () {
    $this->route();

    if ($this->results == null)
      $this->results = array (
        "error" => "Request not routed"
      );
  }

  /**
   * setParameters:
   * @p: array of parameters
   *
   * Sets the #Request parameters.
   */
  final function setParameters ($p) {
    $this->parameters = $p;
  }

  /**
   * getResults
   *
   * Return: results of the #Request
   */
  final function getResults () {
    return json_encode ($this->results);
  }

  /**
   * _executeSQLQuery:
   * @query:  SQL query to execute
   * @parameters: Parameters of the query as #Array
   *
   * Convenience to execute directly an SQL query through
   * the global defined database $db.
   * 
   * Note: A global PDO database must be set under the $db
   * name
   *
   * Return: an #Array containing the results of the query
   */
  final protected function _executeSQLQuery ($query, $parameters) {
    global $db;

    $stmt = $db->prepare($query);

    foreach ($parameters as $key => &$value) {
      $stmt->bindParam($key, $value);
    }

    if (!$stmt->execute()) {
      return array (
        "error" => $stmt->errorInfo()
      );
    }

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
?>

