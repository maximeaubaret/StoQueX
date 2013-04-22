<!DOCTYPE html>
<html>
<head>
<meta content="text/html; charset=ISO-8859-1" http-equiv="content-type">
<title>StoQuEx - Stock Quotes Explorer</title>
<!-- Bootstrap -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes" />
<link href="assets/css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="assets/css/bootstrap-datetimepicker.min.css" rel="stylesheet" media="screen">
<style>
body {
  padding-top: 60px;
}

.navbar-logo {
  height: 40px;

  margin-left: -35px;
  padding-left: 35px;

  background: url(assets/img/logo.png) no-repeat;
  background-position: left center;
  background-size: 30px;
}

.navbar-logo:hover {
  background: url(assets/img/logo-black.png) no-repeat;
  background-position: left center;
  background-size: 30px;
}

.navbar-logo:hover a {
  color: black;
}

form.search {
  margin: 0px;
  padding: 0px;
}

#search {
  -moz-transition:width 500ms, height 500ms, background-color 500ms, -moz-transform 500ms;
  -webkit-transition:width 500ms, height 500ms, background-color 500ms, -webkit-transform 500ms;
  -o-transition:width 500ms, height 500ms, background-color 500ms, -o-transform 500ms;
  transition:width 500ms, height 500ms, background-color 500ms, transform 500ms;
}

#search:focus {
  width: 200px;
}

.company-header {
  border-top: solid 2px rgb(200,200,200);
  border-bottom: solid 2px rgb(200,200,200);
  margin-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.company-header h1 {
  margin: 0px;
  padding: 0px;
  font-size: 20px;
}

.company-header .quote {
  font-size: 34px;
  font-weight: bold;
  margin-right: 5px;
}

.company-header .performance {
  font-size: 22px;
  margin-right: 5px;
}

.company-header .bad {
  color: red;
  background: url(assets/img/arrow-red.png) no-repeat;
  padding-left: 20px;
  background-size: 20px;
  background-position: center left;
}

.company-header .good {
  color: green;
  background: url(assets/img/arrow-green.png) no-repeat;
  padding-left: 20px;
  background-size: 20px;
  background-position: center left;
}

.company-header .date {
  font-size: 15px;
  margin-right: 5px;
}

.section-header {
  border-bottom: solid 2px gray;
  margin-top: 15px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  font-weight: bold;
}

.table .name{
  color: rgb(150,150,150);
  background: rgb(249,249,249);
}

.table .value {
  font-weight: bold;
}

.loader {
  background: url(assets/img/ajax-loader.gif) no-repeat;
  background-position: center center;
}
</style> 
</head>
<body>

<!-- Navbar -->
<div class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container"> 
      <div class="navbar-logo pull-left">
        <a class="brand" href="/">StoQuEx</a>
      </div>
      <div class="container">
        <ul class="nav">
          <li class="active"><a href="#palmares" data-toggle="tab">Palmares</a></li>
          <li class=""><a href="#company-details" data-toggle="tab">Company details</a></li>
        </ul>
        <div class="input-append navbar-search pull-right"> 
          <form class='search' action='#'>
            <input class="span2" id="search" type="text" placeholder="Find a company..." autocomplete="off"/> 
            <div class="btn">
              <i class="icon-search">&nbsp;</i>
            </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container">
  <div class="tab-content">
    <!-- Palmares -->
    <div class="tab-pane" id="palmares">
      <div class="page-header">
        <h1>Palmares</h1>
      </div>
      <div class="row">
        <div class="span4">
          <h2>Green</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Closing value</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>ABC1</td>
              <td>123,45</td>
              <td>+31%</td>
            </tr>
            <tr>
              <td>ABC2</td>
              <td>123,45</td>
              <td>+30%</td>
            </tr>
            <tr>
              <td>ABC3</td>
              <td>123,45</td>
              <td>+29%</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="span4">
          <h2>Red</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Closing value</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>ABC1</td>
              <td>123,45</td>
              <td>-31%</td>
            </tr>
            <tr>
              <td>ABC2</td>
              <td>123,45</td>
              <td>-30%</td>
            </tr>
            <tr>
              <td>ABC3</td>
              <td>123,45</td>
              <td>-29%</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="span4">
          <h2>Volume</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Closing value</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>ABC1</td>
              <td>123,45</td>
              <td>12345</td>
            </tr>
            <tr>
              <td>ABC2</td>
              <td>123,45</td>
              <td>12345</td>
            </tr>
            <tr>
              <td>ABC3</td>
              <td>123,45</td>
              <td>12345</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Company Details -->
    <div class="tab-pane active" id="company-details">
      <div class="row">
        <div class="span12">
          <div class="company-header">
            <h1>Apple Inc. (AAPL)</h1>
            <span class="quote">390.53</span>
            <span class="performance good">1.52 (0.39%)</span>
            <span class="date">Apr. 15</span>
            <span class="muted">
              - <span class="place">NASDAQ</span>
              - <span class="sector">Consumer Discretionary</span>
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span12"> 
          <div class="section-header">
            Overall performance
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span8">
          <div id="overall-chart"> 
            <div class="loader" style="height: 250px;"></div>
          </div>
        </div>
        <div class="span4">
          <table class="table table-bordered">
            <tbody>
            <tr>
              <td class="name">First day</td>
              <td class="value quote-performance">2000-01-03</td>
            </tr>
            <tr>
              <td class="name">Last day</td>
              <td class="value quote-open">2013-04-5</td>
            </tr>
            <tr>
              <td class="name">Close</td>
              <td class="value quote-close">210.8</td>                
            </tr>
            </tbody>
          </table> 
        </div>
      </div>
      <div class="row">
        <div class="span12"> 
          <div class="section-header">
            Performance on a day
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span4">
          <form action="#">
            <fieldset>
              <label>Select a date:</label>
              <div id="date-picker" class="input-prepend">
                <span class="add-on">
                  <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>
                </span>
                <input data-format="yyyy-mm-dd" type="text" placeholder="Date..."/>
              </div>
              <button class="btn btn-small">Update</button>
            </fieldset>
          </form>
        </div>
        <div class="span4">
          <table class="table table-bordered">
            <tbody>
            <tr>
              <td class="name">Performance</td>
              <td class="value quote-performance">+213%</td>
            </tr>
            <tr>
              <td class="name">Open</td>
              <td class="value quote-open">200.4</td>
            </tr>
            <tr>
              <td class="name">Close</td>
              <td class="value quote-close">210.8</td>                
            </tr>
            </tbody>
          </table> 
        </div>
        <div class="span4">
          <table class="table table-bordered">
            <tbody>
            <tr>
              <td class="name">Range</td>
              <td class="value quote-high">210.8 - 984.24</td>
            </tr>
            <tr>
              <td class="name">Volume</td>
              <td class="value quote-volume">4,018,204</td>                
            </tr>
            </tbody>
          </table> 
        </div>
      </div>
      <div class="row">
        <div class="span12">
          <div class="section-header">
            Performance during a date range
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span4">
          <form action="#">
            <fieldset>
              <label>Select a date range:</label>
              <div id="from-picker" class="input-prepend">
                <span class="add-on">
                  <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>
                </span>
                <input data-format="yyyy-mm-dd" type="text" placeholder="From date..."/>
              </div>
              <div id="to-picker" class="input-prepend">
                <span class="add-on">
                  <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>
                </span>
                <input data-format="yyyy-mm-dd" type="text" placeholder="To date..."/>
              </div>
              <button class="btn btn-small">Update</button>
            </fieldset>
          </form>
        </div>
        <div class="span4">
          <div id="close-chart">
            <div class="loader" style="height: 200px;"></div>
          </div>
          <table class="table table-bordered">
            <tbody>
            <tr>
              <td class="name">Performance</td>
              <td class="value quote-performance">+213%</td>
            </tr>
            <tr>
              <td class="name">Number of green days</td>
              <td class="value quote-open">200</td>
            </tr>
            <tr>
              <td class="name">Number of red days</td>
              <td class="value quote-close">148</td>                
            </tr>
            </tbody>
          </table> 
        </div>
        <div class="span4">
          <div id="volume-chart">
            <div class="loader" style="height: 200px;"></div>
          </div>
          <table class="table table-bordered">
            <tbody>
            <tr>
              <td class="name">Range</td>
              <td class="value quote-high">210.8 - 984.24</td>
            </tr>
            <tr>
              <td class="name">First Company</td>
              <td class="value quote-high">12</td>                
            </tr>
            <tr>
              <td class="name">Last Company</td>
              <td class="value quote-low">4</td>                
            </tr>
            </tbody>
          </table> 
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Bootstrap -->
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/underscore-min.js"></script>
<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/js/bootstrap-datetimepicker.min.js"></script>
<script src="assets/js/raphael-min.js"></script>
<script src="assets/js/polychart2.min.js"></script>
<script src="assets/js/moment.min.js"></script>
<script src="assets/js/helper.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>