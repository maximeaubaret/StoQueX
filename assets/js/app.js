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

  graph();
  graphPane();
};

var searchInit = function () {
  var source = $.map (app.companies, function (c) {
    return c.symbol  + " - " + c.company;
  });

  $('#search').typeahead({
    source: source 
  });
};

var graph = function () {
  $.getJSON('api/quotes.php?symbol=AAPL&date=lasts', function (data) {

    polyData =  {
      'Date': [],
      'Open': [],
      'Close': []
    };

    graphMin = graphMax = data[0].close;
    $.each (data, function (key, r) {
      if (r.close > graphMax) graphMax = parseFloat(r.close);
      if (r.close < graphMin) graphMin = parseFloat(r.close);

      polyData['Date'].push(r.date);
      polyData['Open'].push(r.open);
      polyData['Close'].push(r.close);
    });
    marge = (graphMax - graphMin) / 5;
    graphMax += marge;
    graphMin -= marge;

    var polyjsdata = polyjs.data(polyData)
    var spec = {
      layers: [{
        data: polyjsdata,
        type: 'line',
        x: 'Date',
        y: 'Close',
        size: {'const': 3}
      },
      {
        data: polyjsdata,
        type: 'point',
        x: 'Date',
        y: 'Close',
        size: {'const': 4}
      }],
      guides: {
        y: {
          min: graphMin,
          max: graphMax 
        }
      },
      dom: 'chart',
      width: 620,
      height: 400
    }

    polyjs.chart(spec);

    $("#chart .loader").remove();
  });
};

var graphPane = function () {
  var pickers = {
    language: 'us',
    pickTime: false
  }
  $('#from-picker').datetimepicker(pickers);
  $('#to-picker').datetimepicker(pickers);
};

$(document).ready(appInit);
