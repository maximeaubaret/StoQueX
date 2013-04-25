/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

var App = function () {
  this.setup = function () {
    var self = this;

    // Setting up autocomplete search bar
    this.fetchCompanies(function (data) {
      var source = $.map (data, function (c) {
        return c.symbol  + " - " + c.company;
      });

      $('#search').typeahead({source: source});
      $('form.search').submit(function (e) {
        e.preventDefault();

        self.companyDetail($("#search").val());
      });
    });

    this.companyDetail("AAPL");
  };


  this.companyDetail = function (companySymbol) {
    var self = this;

    // Updating company Header
    this.fetchCompanies(companySymbol, function (data) {
      var c = data[0];

      $("#company-details h1").text(c.company + ' (' + c.symbol + ')');
      $("#company-details .quote").text(c.last_close);
      $("#company-details .sector").text(c.sector);
      $("#company-details .place").text(c.place);
      $("#company-details .date").text(moment(c.last_trade).format('MMM Do'));

      // Updating company performance
      $("#company-details .performance").removeClass("good");
      $("#company-details .performance").removeClass("bad");
      c.perf = (Math.floor(parseFloat(((c.last_close / c.last_open) - 1) * 10000)) / 100);
      c.diff = Math.floor((c.last_close - c.last_open) * 100) / 100;

      if (c.perf >= 0)
        $("#company-details .performance").addClass("good");
      else
        $("#company-details .performance").addClass("bad");

      $("#company-details .performance").text(Math.abs(c.diff) + ' (' + Math.abs(c.perf) + '%)');
    });

    // Updating Overall Graph
    $("#overall-chart svg").remove();
    this.fetchQuotes(companySymbol, 'average', function (data) {
      var quotes = self.companyDetail_parseAverageQuotes(data);
      var polyjsdata = polyjs.data(quotes.polyData);

      var specOverallChart = {
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
        dom: 'overall-chart',
        width: 620,
        height: 250,
        paddingTop: -35,
        paddingLeft: -10
      };

      var overallChart = polyjs.chart(specOverallChart);
      $("#overall-chart .loader").remove();
    });

    // Updating date range performance
    $("#close-chart svg").remove();
    $("#volume-chart svg").remove();
    this.fetchQuotes(companySymbol, "lasts", function (data) {
      var quotes = self.companyDetail_parseQuotes(data);
      var polyjsdata = polyjs.data(quotes.polyData);

      var specCloseChart = {
        title: companySymbol,
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
        paddingTop: -30,
        paddingLeft: -10
      };

      var specVolumeChart = {
        title: "Volume",
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
            title: ""
          }
        },
        dom: 'volume-chart',
        width: 300,
        height: 200,
        paddingTop: -30,
        paddingLeft: -10
      };


      var closeChart = polyjs.chart(specCloseChart);
      var volumeChart = polyjs.chart(specVolumeChart);

      $("#close-chart .loader").remove();
      $("#volume-chart .loader").remove();
    });


    // Pane
    var pickers = {
      language: 'us',
      pickTime: false
    };

    $('#date-picker').datetimepicker(pickers);
    $('#from-picker').datetimepicker(pickers);
    $('#to-picker').datetimepicker(pickers);
  };


  this.fetchCompanies = function (symbol, callback) {
    // Searching for all symbols
    if (typeof symbol === 'function') {
      cb = symbol;

      $.getJSON('api/symbols.php', cb);
    }
    // Searching for only one symbol
    else {
      cb = callback;

      $.getJSON('api/symbols.php?symbol=' + symbol, cb);
    }

  };

  this.fetchQuotes = function (symbol, from, to, cb) {
    var url = 'api/quotes.php?symbol=' + symbol;

    // Searching for a date range
    if (typeof cb === 'function') {
      url += '&from=' + from + '&to=' + to;
      callback = cb;
    }
    // Searching for a date or an average
    else if (typeof to === 'function') {
      if (from == 'average') {
        url += '&average';
      }
      else {
        url += '&date=' + from;
      }

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
        'High': [],
        'Low': [],
        'Volume': []
      },
      minimumClose: null,
      maximumClose: null
    };

    if (data.length > 0) {
      r.minimumClose = r.maximumClose = parseFloat(data[0].close);
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

  this.companyDetail_parseAverageQuotes = function (data) {
    var r = {
      polyData: {
        'Date': [],
        'Close': [],
        'High': [],
        'Low': [],
        'Open': [],
        'Volume': []
      },
      minimumClose: null,
      maximumClose: null
    };

    if (data.length > 0) {
      r.minimumClose = r.maximumClose = parseFloat(data[0].average_close);
      $.each (data, function (key, q) {
        if (q.average_close > r.maximumClose) r.maximumClose = parseFloat(q.average_close);
        if (q.average_close < r.minimumClose) r.minimumClose = parseFloat(q.average_close);

        if (q.month < 10) q.month = '0' + q.month;

        r.polyData['Date'].push(q.year + '-' + q.month + '-01');
        r.polyData['Open'].push(q.average_open);
        r.polyData['High'].push(q.average_high);
        r.polyData['Low'].push(q.average_low);
        r.polyData['Volume'].push(q.average_volume);
        r.polyData['Close'].push(q.average_close);
      });
    }

    return r;
  };


  this.setup();
};

var app = new App();
$(document).ready (app);
