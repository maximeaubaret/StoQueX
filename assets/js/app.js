/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

var Model = {
  companies: function (symbol, cb) {
    // Searching for all symbols
    if (typeof symbol === 'function') {
      cb = symbol;
      $.getJSON('api/symbols.php', cb);
    }
    // Searching for only one symbol
    else {
      $.getJSON('api/symbols.php?symbol=' + symbol, cb);
    }
  },
  quotes: function (symbol, from, to, cb) {
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
  },
  parseQuotes: function (data) {
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
  },
  parseAverageQuotes: function (data) {
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
  }
};

var QuoteChart = function (options) {
  var options = options || {
    dom: '',
    title: '',
    width: 320,
    height: 320
  };

  this.render = function (data) {
    var quotes = Model.parseQuotes(data);
    var polyjsdata = polyjs.data(quotes.polyData);

    var spec = {
      title: options.title,
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
      dom: options.dom,
      width: options.width,
      height: options.height,
      paddingTop: -30,
      paddingLeft: -10
    };

    $(options.dom).find("svg").remove();
    polyjs.chart(spec);
  };
};

var VolumeChart = function (options) {
  var options = options || {
    dom: '',
    title: '',
    width: 320,
    height: 320
  };

  this.render = function (data) {
    var quotes = Model.parseQuotes(data);
    var polyjsdata = polyjs.data(quotes.polyData);

    var spec = {
      title: options.title,
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
      dom: options.dom,
      width: options.width,
      height: options.height,
      paddingTop: -30,
      paddingLeft: -10
    };

    $(options.dom).find("svg").remove();
    polyjs.chart(spec);
  };
};

var AverageQuoteChart = function (options) {
  var options = options || {
    dom: '',
    title: '',
    width: 320,
    height: 320
  };

  this.render = function (data) {
    var quotes = Model.parseAverageQuotes(data);
    var polyjsdata = polyjs.data(quotes.polyData);

    var spec = {
      title: options.title,
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
      dom: options.dom,
      width: options.width,
      height: options.height,
      paddingTop: -30,
      paddingLeft: -10
    };

    $(options.dom).find("svg").remove();
    polyjs.chart(spec);
  };
};

var CompanyHeader = function (dom, symbol) {
  this.setup = function () {
    this.renderA();

    Model.companies (symbol, this.renderB);
  }

  this.renderA = function () {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span12">';
    html += '    <div class="company-header">';
    html += '       <div class="loader" style="height: 70px;"></div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
  }

  this.renderB = function (data) {
    data = data[0];

    data.perf = (Math.floor(parseFloat(((data.last_close / data.last_open) - 1) * 10000)) / 100);
    data.diff = Math.floor((data.last_close - data.last_open) * 100) / 100;

    var html = "";

    html += '<div class="row">';
    html += '  <div class="span12">';
    html += '    <div class="company-header" style="height:70px">';
    html += '      <h1>' + data.company + ' (' + data.symbol + ')</h1>';
    html += '      <span class="quote">' + data.last_close +'</span>';

    if (data.diff > 0)
      html += '      <span class="performance good">' + Math.abs(data.diff) + ' (' + Math.abs(data.perf) + '%)</span>';
    else
      html += '      <span class="performance bad">' + Math.abs(data.diff) + ' (' + Math.abs(data.perf) + '%)</span>';

    html += '      <span class="date">' + moment(data.last_trade).format('MMM Do') + '</span>';
    html += '      <span class="muted">';
    html += '        - <span class="place">' + data.place + '</span>';
    html += '        - <span class="sector">' + data.sector + '</span>';
    html += '      </span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
  }

  this.setup ();
}

var OverallPerformance = function (dom, symbol) {
  var chart;

  this.setup = function () {
    this.render();

    chart = new AverageQuoteChart ({
      dom: $(dom).find(".chart")[0],
      width: 940,
      height: 250
    });

    Model.quotes(symbol, 'average', this.renderChart);
  };

  this.render = function () {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span12">';
    html += '    <div class="section-header">';
    html += '      Overall performance';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="row">';
    html += '  <div class="span12">';
    html += '    <div class="chart">';
    html += '      <div class="loader" style="height: 250px;"></div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
  }

  this.renderChart = function (data) {
    chart.render (data);

    $(dom).find(".chart .loader").remove();
  }

  this.setup();
};

var DayPerformance = function (dom, symbol) {
  var date = "";

  this.setup = function () {
    var self = this;

    self.render();

    $(dom).find('button').click(function (e) {
      e.preventDefault();
      date = $(dom).find(".date-picker input").val();

      self.update();
    });

    self.update();
  };

  this.update = function () {
    var self = this;

    if ($(dom).find("input").val() != "") {
      $(dom).find(".loader").show();
      Model.quotes (symbol, date, function (data) {
        $(dom).find(".loader").hide();
        $(dom).find(".data").show();

        if (data.length == 0) {
          $(dom).find('.quote-performance').text("N/A");
          $(dom).find('.quote-open').text("N/A");
          $(dom).find('.quote-close').text("N/A");
          $(dom).find('.quote-range').text("N/A");
          $(dom).find('.quote-volume').text("N/A");
        }
        else {
          data = data[0];
          data.perf = (Math.floor(parseFloat(((data.close / data.open) - 1) * 10000)) / 100) + " %";

          $(dom).find('.quote-performance').text(data.perf);
          $(dom).find('.quote-open').text(data.open);
          $(dom).find('.quote-close').text(data.close);
          $(dom).find('.quote-volume').text(data.volume);
          $(dom).find('.quote-range').text(data.low+ " - " + data.high);
        }
      });
    }
  }

  this.render = function (data) {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span12"> ';
    html += '    <div class="section-header">';
    html += '      Performance on a day';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="row">';
    html += '  <div class="span4" style="height:150px">';
    html += '    <form action="#">';
    html += '      <fieldset>';
    html += '        <label>Select a date:</label>';
    html += '        <div class="date-picker input-prepend">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input data-format="yyyy-MM-dd" type="text" placeholder="Date..." value="' + date + '"/>';
    html += '        </div>';
    html += '        <button class="btn btn-small">Update</button>';
    html += '      </fieldset>';
    html += '    </form>';
    html += '  </div>';
    html += '  <div class="loader hide span8" style="height:150px;"></div>';
    html += '  <div class="data hide">';
    html += '    <div class="span4">';
    html += '      <table class="table table-bordered">';
    html += '        <tbody>';
    html += '        <tr>';
    html += '          <td class="name">Performance</td>';
    html += '          <td class="value quote-performance">+214%</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">Open</td>';
    html += '          <td class="value quote-open">200.4</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">Close</td>';
    html += '          <td class="value quote-close">210.8</td>                ';
    html += '        </tr>';
    html += '        </tbody>';
    html += '      </table> ';
    html += '    </div>';
    html += '    <div class="span4">';
    html += '      <table class="table table-bordered">';
    html += '        <tbody>';
    html += '        <tr>';
    html += '          <td class="name">Range</td>';
    html += '          <td class="value quote-range">4,018,204</td>                ';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">Volume</td>';
    html += '          <td class="value quote-volume">4,018,204</td>                ';
    html += '        </tr>';
    html += '        </tbody>';
    html += '      </table> ';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
    
    var pickers = {
      language: 'us',
      pickTime: false
    };

    picker = $(dom).find('.date-picker').datetimepicker(pickers);
  };

  this.renderB = function (data) {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span12"> ';
    html += '    <div class="section-header">';
    html += '      Performance on a day';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="row">';
    html += '  <div class="span4" style="height: 150px">';
    html += '    <form action="#">';
    html += '      <fieldset>';
    html += '        <label>Select a date:</label>';
    html += '        <div class="date-picker input-prepend">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input data-format="yyyy-MM-dd" type="text" placeholder="Date..." value="' + date + '"/>';
    html += '        </div>';
    html += '        <button class="btn btn-small">Update</button>';
    html += '      </fieldset>';
    html += '    </form>';
    html += '  </div>';
    html += '  <div class="span4">';
    html += '    <table class="table table-bordered">';
    html += '      <tbody>';
    html += '      <tr>';
    html += '        <td class="name">Performance</td>';
    html += '        <td class="value quote-performance">+214%</td>';
    html += '      </tr>';
    html += '      <tr>';
    html += '        <td class="name">Open</td>';
    html += '        <td class="value quote-open">200.4</td>';
    html += '      </tr>';
    html += '      <tr>';
    html += '        <td class="name">Close</td>';
    html += '        <td class="value quote-close">210.8</td>                ';
    html += '      </tr>';
    html += '      </tbody>';
    html += '    </table> ';
    html += '  </div>';
    html += '  <div class="span4">';
    html += '    <table class="table table-bordered">';
    html += '      <tbody>';
    html += '      <tr>';
    html += '        <td class="name">Range</td>';
    html += '        <td class="value quote-range">4,018,204</td>                ';
    html += '      </tr>';
    html += '      <tr>';
    html += '        <td class="name">Volume</td>';
    html += '        <td class="value quote-volume">4,018,204</td>                ';
    html += '      </tr>';
    html += '      </tbody>';
    html += '    </table> ';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
    
    var pickers = {
      language: 'us',
      pickTime: false
    };

    picker = $(dom).find('.date-picker').datetimepicker(pickers);
  };

  this.click = function (e) {
    e.preventDefault();
    this.update();
  };

  this.setup ();
};

var DateRangePerformance = function (dom, symbol) {
  var from = "";
  var to = "";

  this.setup = function () {
    this.update();
  };

  this.update = function () {
    var self = this;

    this.render();

    $(dom).find('button').click(function (e) {
      e.preventDefault();
      var fromTmp = $(dom).find(".from-picker input").val();
      var toTmp = $(dom).find(".to-picker input").val();

      if (fromTmp != "" && toTmp != "") {
        from = fromTmp;
        to = toTmp;
        if (moment(fromTmp, "YYYY-MM-DD").unix() > moment(toTmp, "YYYY-MM-DD").unix()) {
          from = toTmp;
          to = fromTmp;
        }


        self.update();
      }
    });

    closeChart = new QuoteChart ({
      title: symbol,
      dom: $(dom).find(".close-chart")[0],
      width: 300,
      height: 200
    });

    volumeChart = new VolumeChart ({
      title: "Volume",
      dom: $(dom).find(".volume-chart")[0],
      width: 300,
      height: 200
    });

    if ($(dom).find(".from-picker input").val() != "" &&
        $(dom).find(".to-picker input").val() != "") {
      $(dom).find(".data-loader").show();
      Model.quotes (symbol, from, to, function (data) {
        $(dom).find(".data-loader").hide();

        $(dom).find(".data").show();
        if (data.length > 0) {
          data.reverse();

          green = $.map (data, function (e) {
            if (e.close > e.open)
              return e;
          });

          red = $.map (data, function (e) {
            if (e.close <= e.open)
              return e;
          });

          min = data[0].low;
          for (var i = 1; i < data.length; i++) {
            if (data[i].low < min) min = data[i].low;
          }

          max = data[0].high;
          for (var i = 1; i < data.length; i++) {
            if (data[i].high > max) max = data[i].high;
          }

          perf = (Math.floor(parseFloat(((data[data.length - 1].close / data[0].open) - 1) * 10000)) / 100) + " %";

          $(dom).find('.quote-performance').text(perf);
          $(dom).find('.quote-green-days').text(green.length);
          $(dom).find('.quote-red-days').text(red.length);
          $(dom).find('.quote-range').text(min + " - " + max);
          $(dom).find('.quote-first').text("first");
          $(dom).find('.quote-last').text("last");


          self.renderCharts(data);
        }
        else {
          $(dom).find(".close-chart .loader").remove();
          $(dom).find(".volume-chart .loader").remove();

          $(dom).find(".close-chart .nodata").show();
          $(dom).find(".volume-chart .nodata").show();


          $(dom).find('.quote-performance').text("N/A");
          $(dom).find('.quote-green-days').text("N/A");
          $(dom).find('.quote-red-days').text("N/A");
          $(dom).find('.quote-range').text("N/A");
          $(dom).find('.quote-first').text("N/A");
          $(dom).find('.quote-last').text("N/A");
        }
      });
    }
  }

  this.render = function () {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span12">';
    html += '    <div class="section-header">';
    html += '      Performance during a date range';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    html += '<div class="row">';
    html += '  <div class="span4" style="height: 340px">';
    html += '    <form action="#">';
    html += '      <fieldset>';
    html += '        <label>Select a date range:</label>';
    html += '        <div class="input-prepend from-picker">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input data-format="yyyy-MM-dd" type="text" placeholder="From date..." value="' + from + '"/>';
    html += '        </div>';
    html += '        <div class="input-prepend to-picker">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input data-format="yyyy-MM-dd" type="text" placeholder="To date..." value="' + to + '"/>';
    html += '        </div>';
    html += '        <button class="btn btn-small">Update</button>';
    html += '      </fieldset>';
    html += '    </form>';
    html += '  </div>';
    html += '  <div class="data-loader loader span8 hide" style="height: 250px"></div>';
    html += '  <div class="data hide">';
    html += '    <div class="span4">';
    html += '      <div class="close-chart">';
    html += '        <div class="loader" style="height: 200px;"></div>';
    html += '        <div class="nodata hide" style="height: 200px;">N/A</div>';
    html += '      </div>';
    html += '      <table class="table table-bordered">';
    html += '        <tbody>';
    html += '        <tr>';
    html += '          <td class="name">Performance</td>';
    html += '          <td class="value quote-performance">+213%</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">Number of green days</td>';
    html += '          <td class="value quote-green-days">200</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">Number of red days</td>';
    html += '          <td class="value quote-red-days">148</td>';
    html += '        </tr>';
    html += '        </tbody>';
    html += '      </table> ';
    html += '    </div>';
    html += '    <div class="span4">';
    html += '      <div class="volume-chart">';
    html += '        <div class="loader" style="height: 200px;"></div>';
    html += '        <div class="nodata hide" style="height: 200px;">N/A</div>';
    html += '      </div>';
    html += '      <table class="table table-bordered">';
    html += '        <tbody>';
    html += '        <tr>';
    html += '          <td class="name">Range</td>';
    html += '          <td class="value quote-range">210.8 - 984.24</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">First Company</td>';
    html += '          <td class="value quote-first">12</td>';
    html += '        </tr>';
    html += '        <tr>';
    html += '          <td class="name">Last Company</td>';
    html += '          <td class="value quote-last">4</td>';
    html += '        </tr>';
    html += '        </tbody>';
    html += '      </table> ';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
    
    var pickers = {
      language: 'us',
      pickTime: false
    };

    $(dom).find('.from-picker').datetimepicker(pickers);
    $(dom).find('.to-picker').datetimepicker(pickers);
  };

  this.renderCharts = function (data) {
    closeChart.render (data);
    volumeChart.render (data);

    $(dom).find(".close-chart .loader").remove();
    $(dom).find(".volume-chart .loader").remove();
  };

  this.setup ();
};


var App = function () {
  this.setup = function () {
    var self = this;
		
    // Setting up autocomplete search bar
    this.fetchCompanies(function (data) {
      $.each (data, function (i, c) {
        $("#search").append("<option value='" + c.symbol + "'>" + c.company + " - " + c.symbol + "</option>");
      });

      $(".chzn-select").chosen().change(function () {
        $("a[href='#company-details']").click();

        self.companyDetail($("#search").val());
      });
    });

    this.companyDetail("AAPL");
  };

  /** Palmares Page **/

  /** Company Detail Page **/
  this.companyDetail = function (companySymbol) {
    var self = this;

    // Updating company Header
    new CompanyHeader ($("#company-header")[0], companySymbol);

    // Updating Overall Graph
    new OverallPerformance ($("#overall-performance")[0], companySymbol); 

    // Updating Performance on a day
    new DayPerformance ($("#day-performance")[0], companySymbol);

    // Updating date range performance
    new DateRangePerformance ($("#date-range-performance")[0], companySymbol); 

    // Pane
    var pickers = {
      language: 'us',
      pickTime: false
    };


    // $('#date-picker').datetimepicker(pickers);
    // $('#day-performance button').click(function (e) {
    //   e.preventDefault();
    // });
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
