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
          <li class="active"><a href="#palmares" data-toggle="tab">Palmares</a></li>
          <li class=""><a href="#company-details" data-toggle="tab">Company details</a></li>
        </ul>
        <div id="search-container" class="input-append navbar-search pull-right hide"> 
          <select id="search" data-placeholder="Choose a company" class="chzn-select hide"></select>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Pages -->
<div class="container">
  <div class="tab-content">

    <!-- Palmares -->
    <div class="tab-pane active" id="palmares"></div>


    <!-- Company details -->
    <div class="tab-pane" id="company-details">
      <div class="pane-loader loader hide" style="height: 300px"></div>

      <!-- Company Header -->
      <div id="company-header"></div>

      <!-- Overall Performance -->
      <div id="overall-performance"></div>

      <!-- Performance on a day -->
      <div id="day-performance"></div>

      <!-- Performance on a date range -->
      <div id="date-range-performance"></div>

    </div>
    <!-- END: Company details -->
  </div>

  <div class="container">
    <p class="copyright">
      Made with love by Aubaret Maxime &amp; Toni Alexandre
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
