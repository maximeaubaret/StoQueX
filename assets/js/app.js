/**
 * StoQuEx
 * (as seen by maubaret & atoni)
 *
 * @author Maxime Aubaret <maxime@particleslab.com>
 * @author Alexandre Toni <alexandre@particleslab.com>
 */

var MODEL_ROOT_URL = 'api.php';
var Model = {
  companies: function (symbol, cb) {
    // Searching for all symbols
    if (typeof symbol === 'function') {
      cb = symbol;
      $.getJSON(MODEL_ROOT_URL + '?q=symbols', cb);
    }
    // Searching for only one symbol
    else {
      $.getJSON(MODEL_ROOT_URL + '?q=symbols&symbol=' + symbol, cb);
    }
  },
  palmares: function (date, cb) {
    var url = MODEL_ROOT_URL + '?q=palmares&date=' + date;
    $.getJSON(url, cb);
  },
  quotes: function (symbol, from, to, cb) {
    var url = MODEL_ROOT_URL + '?q=quotes&symbol=' + symbol;

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
      else if (from == 'lasts') {
        url += '&lasts';
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
  sp: function (from, to, cb) {
    var url = MODEL_ROOT_URL + '?q=quotes&sp500';

    // Searching for a date range
    url += '&from=' + from + '&to=' + to;
    callback = cb;

    $.getJSON(url, callback);
  },
  lastQuote: function (cb) {
    var url = MODEL_ROOT_URL + '?q=quotes&lastquote';
    $.getJSON(url, cb);
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
  },
  parseSP: function (data) {
    var r = {
      polyData: {
        'Date': [],
        'Close': [],
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
        r.polyData['Volume'].push(q.volume);
        r.polyData['Close'].push(q.close);
      });
    }

    return r;
  },
  firstlast: function (symbol, from, to, cb) {
    var url = MODEL_ROOT_URL + '?q=quotes&firstlast&from=' + from + '&to=' + to + '&symbol=' + symbol;
    $.getJSON(url, cb);
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

var SPChart = function (options) {
  var options = options || {
    dom: '',
    title: '',
    width: 320,
    height: 320
  };

  this.render = function (data) {
    var quotes = Model.parseSP(data);
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
          renderGrid: true
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
          renderGrid: true,
          title: ""
        },
        y: {
          renderGrid: true,
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
          min: 0,
          renderGrid: true
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

var CompanyHeader = function (master, dom, symbol, redcarpet) {
  var self = this;

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

    $(dom).html(html).hide();
  }

  this.renderB = function (data) {

    if (data.length == 0) {
      Model.quotes(symbol, "lasts", function (data2) {
        self.renderB([{
          'symbol': data2[0].symbol,
          'last_close': data2[0].close,
          'last_high': data2[0].high,
          'last_low': data2[0].low,
          'last_open': data2[0].open,
          'last_volume': data2[0].volume,
          'place': '',
          'sector': '',
          'company': ''
        }]);
      });
    }
    else {
      data = data[0];

      data.perf = (Math.floor(parseFloat(((data.last_close / data.last_open) - 1) * 10000)) / 100);
      data.diff = Math.floor((data.last_close - data.last_open) * 100) / 100;

      var html = "";

      html += '<div class="row">';
      html += '  <div class="span12">';
      html += '    <div class="company-header" style="height:70px">';

      if (data.company != "")
        html += '      <h1>' + data.company + ' (' + data.symbol + ')</h1>';
      else
        html += '      <h1>' + data.symbol + '</h1>';


      html += '      <span class="quote">' + parseFloat(data.last_close).toFixed(2) +'</span>';

      if (data.diff > 0)
        html += '      <span class="performance good">' + Math.abs(data.diff) + ' (' + Math.abs(data.perf) + '%)</span>';
      else
        html += '      <span class="performance bad">' + Math.abs(data.diff) + ' (' + Math.abs(data.perf) + '%)</span>';

      html += '      <span class="date">' + moment(data.last_trade).format('MMM Do') + '</span>';

      if (data.place != '' && date.sector != '') {
        html += '      <span class="muted">';
        html += '        - <span class="place">' + data.place + '</span>';
        html += '        - <span class="sector">' + data.sector + '</span>';
        html += '      </span>';
      }

      html += '    </div>';
      html += '  </div>';
      html += '</div>';

      $(dom).html(html);

      redcarpet(master, 'header');
    }
  }

  this.setup ();
}

var OverallPerformance = function (master, dom, symbol, redcarpet) {
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

    $(dom).html(html).hide();
  }

  this.renderChart = function (data) {
    chart.render (data);

    $(dom).find(".chart .loader").remove();

    redcarpet(master, 'overall');
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
      $(dom).find(".loader").fadeIn();
      $(dom).find(".data").hide();
      Model.quotes (symbol, date, function (data) {
        $(dom).find(".loader").hide();
        $(dom).find(".data").fadeIn();

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
          $(dom).find('.quote-volume').text(addCommas(data.volume));
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

    $(dom).html(html).hide();
    
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

    $(dom).html(html).hide();
    
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
  var firsttime = 1;

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
      $(dom).find(".data-loader").fadeIn();
      Model.quotes (symbol, from, to, function (data) {
        Model.firstlast (symbol, from, to, function (firstlast) {
          $(dom).find(".data-loader").hide();

          $(dom).find(".data").fadeIn();
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
            $(dom).find('.quote-first').text(firstlast.first);
            $(dom).find('.quote-last').text(firstlast.last);


            self.renderCharts(data);
          }
          else {
            $(dom).find(".close-chart .loader").remove();
            $(dom).find(".volume-chart .loader").remove();

            $(dom).find(".close-chart .nodata").fadeIn();
            $(dom).find(".volume-chart .nodata").fadeIn();


            $(dom).find('.quote-performance').text("N/A");
            $(dom).find('.quote-green-days').text("N/A");
            $(dom).find('.quote-red-days').text("N/A");
            $(dom).find('.quote-range').text("N/A");
            $(dom).find('.quote-first').text("N/A");
            $(dom).find('.quote-last').text("N/A");
          }
        });
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

    if (firsttime == 1) {
      $(dom).html(html).hide();
    }
    else {
      $(dom).html(html);
    }
    firsttime++;
    
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


var RankPerfTable = function (dom) {
  this.render = function (data) {
    var html = "";

    html += '<table class="table palmares-table">';
    html += '  <thead>';
    html += '    <tr>';
    html += '      <th class="company-name">Company</th>';
    html += '      <th class="close-value">Closing value</th>';
    html += '      <th class="perf">Performance</th>';
    html += '    </tr>';
    html += '  </thead>';
    html += '  <tbody>';

    $.each (data, function (i, e) {
      html += '  <tr onclick="javascript:detail(\'' + e.symbol + '\')">';
      html += '    <td class="company-name">' + e.symbol + '</td>';
      html += '    <td class="close-value">' + e.close + '</td>';
      html += '    <td class="perf">' + parseFloat(e.perf).toFixed(2) + '%</td>';
      html += '  </tr>';
    });


    html += '  </tbody>';
    html += '</table>';

    $(dom).html(html);
  };
};

var RankVolumeTable = function (dom) {
  this.render = function (data) {
    var html = "";

    html += '<table class="table palmares-table">';
    html += '  <thead>';
    html += '    <tr>';
    html += '      <th class="company-name">Company</th>';
    html += '      <th class="close-value">Closing value</th>';
    html += '      <th class="perf">Volume</th>';
    html += '    </tr>';
    html += '  </thead>';
    html += '  <tbody>';

    $.each (data, function (i, e) {
      html += '  <tr onclick="javascript:detail(\'' + e.symbol + '\')">';
      html += '    <td class="company-name">' + e.symbol + '</td>';
      html += '    <td class="close-value">' + e.close + '</td>';
      html += '    <td class="perf">' + addCommas(e.volume) + '</td>';
      html += '  </tr>';
    });


    html += '  </tbody>';
    html += '</table>';

    $(dom).html(html);
  };
};

var Palmares = function (dom) {
  this.setup = function () {
    var self = this;

    self.date = "";

    Model.lastQuote (function (data) {
      self.date = data[0].date;

      self.render();

      var pickers = {
        language: 'us',
        pickTime: false
      };

      picker = $(dom).find('.date-picker').datetimepicker(pickers);

      $(dom).find('button').click(function (e) {
        e.preventDefault();

        date = $(dom).find('.date-picker input').val();
        self.update (date);
      });

      $(dom).find('button').click();
    });
  };

  this.render = function () {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span3">';
    html += '    <div class="header">';
    html += '    Palmares';
    html += '      <p>';
    html += '        Each day, the rankings of the best and worst companies are calculated. Select a date to view those rankings.';
    html += '      </p>';
    html += '    </div>';
    html += '    <form action="#">';
    html += '      <fieldset>';
    html += '        <label style="font-size: 14px">Select a date:</label>';
    html += '        <div class="date-picker input-prepend">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input style="width: 100px" data-format="yyyy-MM-dd" type="text" placeholder="Date..." value="' + this.date + '"/>';
    html += '        </div>';
    html += '        <button class="btn btn-small">Update</button>';
    html += '      </fieldset>';
    html += '    </form>';
    html += '  </div>';
    html += '  <!-- Green -->';
    html += '  <div class="span3">';
    html += '    <div class="subheader">';
    html += '    In the green';
    html += '    </div>';

    html += '    <div class="green hide"></div>';
    html += '    <div class="loader" style="height: 150px"></div>';
    html += '  </div>';

    html += '  <!-- Red -->';
    html += '  <div class="span3">';
    html += '    <div class="subheader">';
    html += '      In the red';
    html += '    </div>';

    html += '    <div class="red hide"></div>';
    html += '    <div class="loader" style="height: 150px"></div>';
    html += '  </div>';

    html += '  <!-- Volume -->';
    html += '  <div class="span3">';
    html += '    <div class="subheader">';
    html += '      By volume';
    html += '    </div>';

    html += '    <div class="volume hide"></div>';
    html += '    <div class="loader" style="height: 150px"></div>';
    html += '  </div>';
    html += '</div>';

    $(dom).find(".pane-loader").hide();
    $(dom).html(html).hide().fadeIn(500).attr('style', '');
  };

  this.update = function (date) {
    Model.palmares (date, function (data) {
      new RankPerfTable($(dom).find(".green")[0]).render(data.green);
      new RankPerfTable($(dom).find(".red")[0]).render(data.red);
      new RankVolumeTable($(dom).find(".volume")[0]).render(data.volume);

      $(dom).find(".loader").hide();
      $(dom).find(".green").fadeIn(200, function () {
        $(dom).find(".red").fadeIn(200, function () {
          $(dom).find(".volume").fadeIn(200);
        });
      });
    });
  };


  this.setup();
};


var SP = function (dom) {
  var from = "2000-01-01";
  var to = moment().format("YYYY-MM-DD");

  var self = this;

  this.setup = function () {

    this.update();
  };

  this.update = function () {
    self.render();

    var pickers = {
      language: 'us',
      pickTime: false
    };

    picker = $(dom).find('.from-picker').datetimepicker(pickers);
    picker = $(dom).find('.to-picker').datetimepicker(pickers);

    $(dom).find("button").click (function (e) {
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

    if ($(dom).find(".from-picker input").val() != "" &&
        $(dom).find(".to-picker input").val() != "") {
    Model.sp(from, to, function (data) {
      $(dom).find(".loader").hide();
      $(dom).find(".chart").hide();
      self.renderGraph(data);
    });
    }
  };

  this.render = function () {
    var html = "";

    html += '<div class="row">';
    html += '  <div class="span3">';
    html += '    <div class="header">';
    html += '      S&amp;P 500';
    html += '      <p>';
    html += '        The S&amp;P 500, or the Standard &amp; Poor\'s 500, is a stock market index based on the market capitalizations of 500 leading companies publicly traded in the U.S. stock market, as determined by Standard &amp; Poor\'s';
    html += '      </p>';
    html += '    </div>';
    html += '    <form action="#">';
    html += '      <fieldset>';
    html += '        <label style="font-size: 14px">Select a date:</label>';
    html += '        <div class="from-picker input-prepend">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input style="width: 100px" data-format="yyyy-MM-dd" type="text" placeholder="From..." value="' + from + '"/>';
    html += '        </div>';
    html += '        <div class="to-picker input-prepend">';
    html += '          <span class="add-on">';
    html += '            <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>';
    html += '          </span>';
    html += '          <input style="width: 100px" data-format="yyyy-MM-dd" type="text" placeholder="To..." value="' + to + '"/>';
    html += '        </div>';
    html += '        <button class="btn btn-small">Update</button>';
    html += '      </fieldset>';
    html += '    </form>';
    html += '  </div>';
    html += '  <div class="span9">';
    html += '    <div class="loader" style="height: 250px"></div>';
    html += '    <div class="chart"></div>';
    html += '  </div>';
    html += '</div>';

    $(dom).html(html);
  };

  this.renderGraph = function (data) {
    chart = new SPChart ({
      dom: $(dom).find(".chart")[0],
      width: 700,
      height: 250
    });

    chart.render (data);
    $(dom).find(".chart").fadeIn(500);
  };

  this.setup ();
};


var App = function () {
  this.setup = function () {
    var self = this;

    self.symbol = 'AAPL';
		
    // Setting up autocomplete search bar
    this.fetchCompanies(function (data) {
      $.each (data, function (i, c) {
        $("#search").append("<option value='" + c.symbol + "'>" + c.company + " - " + c.symbol + "</option>");
      });

      $(".chzn-select").chosen().change(function () {
        self.symbol = $("#search").val();
        $("a[href='#company-details']").click();
      });

      $("#search-container").fadeIn();
    });

    $("a[href='#company-details']").click(function () {
      self.companyDetail(self.symbol);
    });

    $("a[href='#sp']").click(function () {
      self.sp();
    });

    this.palmares();
  };

  /** Palmares Page **/
  this.palmares = function () {
    new Palmares ($("#palmares")[0]);
  };

  /** Company Detail Page **/
  this.companyDetail = function (companySymbol) {
    var self = this;

    self.companyDetailRedCarpetData = 2;

    $("#company-details .pane-loader").show();
    $(".copyright").hide();

    // Updating company Header
    new CompanyHeader (self, $("#company-header")[0], companySymbol, self.companyDetailRedCarpet);

    // Updating Overall Graph
    new OverallPerformance (self, $("#overall-performance")[0], companySymbol, self.companyDetailRedCarpet); 

    // Updating Performance on a day
    new DayPerformance ($("#day-performance")[0], companySymbol, self.companyDetailRedCarpet);

    // Updating date range performance
    new DateRangePerformance ($("#date-range-performance")[0], companySymbol, self.companyDetailRedCarpet); 
  };

  this.companyDetailRedCarpet = function (self, name) {
    self.companyDetailRedCarpetData--;
    if (self.companyDetailRedCarpetData == 0) {
      $("#company-details .pane-loader").hide();

      $("#company-header").fadeIn(500, function () {
        $("#overall-performance").fadeIn(500, function () {
          $("#day-performance").fadeIn(500, function () {
            $("#date-range-performance").fadeIn(500, function () {
              $(".copyright").fadeIn(500);
            });
          });
        });
      });
    }
  }

  this.sp = function () {
    new SP($("#sp")[0]);
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
        r.polyData['Volume'].push(addCommas(q.volume));
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

var detail = function (symbol) {
  app.symbol = symbol;
  $("a[href='#company-details']").click();
};

var app = new App();
$(document).ready (app);
