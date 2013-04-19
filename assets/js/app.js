/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

var App = function () {
  this.companies = [];

  this.setup = function () {
    var self = this;

    // Setting up autocomplete search bar
    this.fetchCompanies(function () {
      var source = $.map (self.companies, function (c) {
        return c.symbol  + " - " + c.company;
      });

      $('#search').typeahead({source: source});
    }); 

    this.companyDetail("AAPL");
  };


  this.companyDetail = function (companySymbol) {
    var self = this;
    this.fetchQuotes (companySymbol, "lasts", function (data) {
      var quotes = self.companyDetail_parseQuotes(data);
      var polyjsdata = polyjs.data(quotes.polyData);

      var specCloseChart = {
        layers: [{
          data: polyjsdata,
          type: 'line',
          x: 'Date',
          y: 'Close',
          size: {'const': 2}
        },
        {
          data: polyjsdata,
          type: 'area',
          x: 'Date',
          y: 'Close',
          size: {'const': 2},
          opacity: {'const': 0.2}
        }],
        guides: {
          x: {
            title: "",
            renderGrid: true
          },
          y: {
            title: "",
            renderGrid: true,
            min: quotes.minimumClose - ((quotes.maximumClose - quotes.minimumClose) / 5),
            max: quotes.maximumClose + ((quotes.maximumClose - quotes.minimumClose) / 5)
          }
        },
        dom: 'close-chart',
        width: 300,
        height: 200,
        paddingTop: -30
      };

      var specVolumeChart = {
        layers: [{
          data: polyjsdata,
          tooltip: "",
          type: 'bar',
          x: 'bin(Date, day)',
          y: 'Volume'
        }],
        guides: {
          x: {
            title: ""
          },
          y: {
            title: "",
          }
        },
        dom: 'volume-chart',
        width: 300,
        height: 200,
        paddingTop: -30
      };

      var closeChart = polyjs.chart(specCloseChart);
      var volumeChart = polyjs.chart(specVolumeChart);
      $("#close-chart .loader").remove();
      $("#volume-chart .loader").remove();
    });
  };


  this.fetchCompanies = function (callback) {
    var self = this;
    // Drawing graph
    $.getJSON('api/symbols.php', function (data) {
      self.companies = data;
      if (callback != undefined) callback(data);
    });

    // Pane
    var pickers = {
      language: 'us',
      pickTime: false
    }
    $('#date-picker').datetimepicker(pickers);
    $('#from-picker').datetimepicker(pickers);
    $('#to-picker').datetimepicker(pickers);
  };

  this.fetchQuotes = function (symbol, from, to, cb) {
    var url = 'api/quotes.php?symbol=' + symbol;

    // Searching for a date range
    if (typeof cb === 'function') {
      url += '&from=' + from + '&to=' + to;
      callback = cb;
    }
    // Searching for a date
    else if (typeof to === 'function') {
      url += '&date=' + from;
      callback = to;
    }
    // Searching for all quotes
    else if (typeof from === 'function')  {
      callback = from;
    }

    $.getJSON(url, callback);
  };


  this.companyDetail_parseQuotes = function (data) {
    var r = {
      polyData: {
        'Date': [],
        'Performance': [],
        'Open': [],
        'Close': [],
        'Open': [],
        'High': [],
        'Low': [],
        'Volume': [],
        'Close': []
      },
      minimumClose: null,
      maximumClose: null
    };

    if (data.length > 0) {
      r.minimumClose = r.maximumClose = data[0].close;
      $.each (data, function (key, q) {
        if (q.close > r.maximumClose) r.maximumClose = parseFloat(q.close);
        if (q.close < r.minimumClose) r.minimumClose = parseFloat(q.close);

        r.polyData['Date'].push(q.date);
        r.polyData['Open'].push(q.open);
        r.polyData['High'].push(q.high);
        r.polyData['Low'].push(q.low);
        r.polyData['Volume'].push(q.volume);
        r.polyData['Close'].push(q.close);
        r.polyData['Performance'].push(Math.floor(parseFloat(((q.close / q.open) - 1) * 10000)) / 100);
      });
    }

    return r;
  };


  this.setup();
}

$(document).ready (new App());
