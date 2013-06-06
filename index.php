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
<link href="assets/css/chosen.css" rel="stylesheet" media="screen">
<link href="assets/css/stoquex.css" rel="stylesheet" media="screen">
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
          <li class=""><a href="#palmares" data-toggle="tab">Palmares</a></li>
          <li class="active"><a href="#company-details" data-toggle="tab">Company details</a></li>
        </ul>
        <div class="input-append navbar-search pull-right"> 
          <select id="search" data-placeholder="Choose a company" class="chzn-select"></select>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Pages -->
<div class="container">
  <div class="tab-content">


    <!-- Palmares -->
    <div class="tab-pane" id="palmares">
      <div class="page-header">
        <h1>Palmares</h1>
      </div>

      <div class="row">
        <!-- Green -->
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
        <!-- END: Green -->

        <!-- Red -->
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
        <!-- END: Red -->

        <!-- Volume -->
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
        <!-- END: Volume -->
      </div>
    </div>
    <!-- END: Palmares -->



    <!-- Company details -->
    <div class="tab-pane active" id="company-details">

      <!-- Company Header -->
      <div id="company-header">
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
      </div>
      <!-- END: Company Header -->


      <!-- Overall Performance -->
      <div id="overall-performance">
        <div class="row">
          <div class="span12"> 
            <div class="section-header">
              Overall performance
            </div>
          </div>
        </div>

        <div class="row">
          <div class="span12">
            <div id="overall-chart">
              <div class="loader" style="height: 250px;"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Overall Performance -->


      <!-- Performance on a day -->
      <div id="day-performance">
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
                  <input data-format="yyyy-MM-dd" type="text" placeholder="Date..."/>
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
                <td class="value quote-performance">+214%</td>
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
      </div>
      <!-- END: Performance on a day -->

      <!-- Performance on a date range -->
      <div id="date-range-performance">
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
                  <input data-format="yyyy-MM-dd" type="text" placeholder="From date..."/>
                </div>
                <div id="to-picker" class="input-prepend">
                  <span class="add-on">
                    <i data-time-icon="icon-time" data-date-icon="icon-calendar">&nbsp;</i>
                  </span>
                  <input data-format="yyyy-MM-dd" type="text" placeholder="To date..."/>
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
      <!-- END: Performance on a date range -->

    </div>
    <!-- END: Company details -->
  </div>

  <div class="container">
    <p class="copyright">
      A production Aubaret Maxime &amp; Toni Alexandre
    </p>
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
<script src="assets/js/chosen.jquery.min.js"></script>
<script src="assets/js/helper.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
