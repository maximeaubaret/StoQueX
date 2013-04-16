/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

var app = {
  companies: []
};

var appInit = function () {

  // Fetch companies
  $.getJSON('api/symbols.php', function (data) {
    app.companies = data;

    searchInit();
  });
};

var searchInit = function () {
  var source = $.map (app.companies, function (c) {
    return c.symbol  + " - " + c.company;
  });

  $('#search').typeahead({
    source: source 
  });
};

$(document).ready(appInit);
