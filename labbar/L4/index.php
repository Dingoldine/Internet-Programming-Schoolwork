<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport"
       content="width=device-width, initial-scale=1, user-scalable=yes">

      <!--Required meta tags-->
      <meta charset="utf-8">
      <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
      <meta name="viewport" content="width=device-width" />

      <!-- Bootstrap core CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

      <!-- jQuery first, then Bootstrap JS -->
    <script
          src="https://code.jquery.com/jquery-2.2.4.min.js"
          integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
          crossorigin="anonymous"></script>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.7.1/css/bootstrap-slider.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.7.1/bootstrap-slider.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

  </head>
  <body>

  <div class ="row">
    <div class="col-md-4">
      <form name="form.SearchForm" action="search.php" method="post">

              <!-- CITY, POPULATE DYNAMICALLY -->
              <div class="form-group">
                  <label>Stad</label>
                  <select id ="lan" name="lan">
                 <?php
                $server = "mysql-vt2018.csc.kth.se";
                $username = "rumman_admin";
                $password = "J5yULeh1FJl5";
                $dbname = "rumman";
                $conn = new PDO("mysql:host=$server;dbname=$dbname;charset=utf8", $username, $password);
                //Connect to database
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                //Select one of each city type
                $query = $conn->prepare('SELECT DISTINCT lan FROM bostader');
                $query->execute();
                    //Loop through result and turn each into an option
                    while($row = $query->fetch()) {  
                      echo "<option>".$row['lan']."</option>";
                    }
                ?>
                </select>
              </div>

              <!-- TYPE -->
              <div class="form-group" >
                  <label>Typ</label>
                  <br>  
                    <input type="radio" id="isVillaSelected"  name="type" value="Villa"><label for="isVillaSelected" class="light">Villa</label><br>
                    <input type="radio" id="isBostadSelected" name="type" value="Bostadsrätt" checked><label for="isBostadSelected" class="light">Bostadsrätt</label><br>
              </div>

              <!-- SIZE -->
              <div class="form-group" >
                <label>Storlek i m²</label>   
                <br>
                <br>       
                <b>20</b>
                <input id ="sizeSlider" type="text" class="slider" value="" data-slider-min="20" data-slider-max="200" data-slider-step="5" data-slider-value="[30,120]"/> <b>200</b>
              </div>


              <!-- ROOMS -->
              <div class="form-group" >
                <label>Antal Rum</label>   
                <br>
                <br>
                <br>       
                <b>1</b>
                <input id="roomSlider" type="text" class="slider" value="" data-slider-min="1" data-slider-max="10" data-slider-step="1" data-slider-value="[3,4]"/> <b>10</b>
              </div>


              <!-- FEE -->
              <div class="form-group" >
                <label>Avgift</label>   
                <br>
                <br>
                <br>       
                <b>500 kr</b>
                <input type="text" id="feeSlider" class="slider" value="" data-slider-min="500" data-slider-max="5000" data-slider-step="100" data-slider-value="[1000,2000]"/> 
                <b>5000kr</b>
              </div>

              <!-- PRICE -->
              <div class="form-group" >
                <label>Pris</label>   
                <br>
                <br>
                <br>       
                <b>100.000 kr</b>
                <input type="text" id="priceSlider" class="slider" value="" data-slider-min="100000" data-slider-max="10000000" data-slider-step="100000" data-slider-value="[3000000,6000000]"/> 
                <b>10.000.000 kr</b>
              </div>

                <div class="form-group" > 
                  <input type="submit" value="Submit"/> 
                </div>
              </form>
        </div>
  </div>


  <div class='row'>
    <div class="col-lg-2" align="center">
    <table class="table table-hover" datatable="ng">
      <thead>
          <th> <a id='lan' href="#" onclick="orderByDesc('lan')"> Komun </a></th>
          <th> <a id='objekttyp' href="#" onclick="orderByDesc('objekttyp')"> Typ </a></th>
          <th> <a id='adress' href="#" onclick="orderByDesc('adress')"> Adress </a></th>
          <th> <a id='rum' href="#" onclick="orderByDesc('rum')"> Rum </a></th>
          <th> <a id='area' href="#" onclick="orderByDesc('area')"> Area </a></th>
          <th> <a id='avgift' href="#" onclick="orderByDesc('avgift')">Avgift </a> </th>
          <th> <a id='pris' href="#" onclick="orderByDesc('pris')">Pris </a> </th>
      </thead>
      <tbody id="result">
      </tbody>
    </table>
  </div>
  </div>


    <script  type="text/javascript">
    //Initialize bootsrap sliders  

    var slider1 = new Slider('#sizeSlider', {
    	tooltip: 'always'
    });
    var slider2 = new Slider('#roomSlider', {
    	tooltip: 'always'
    });
    var slider3 = new Slider('#priceSlider', {
      tooltip: 'always'
    });
    var slider4 = new Slider('#feeSlider', {
      tooltip: 'always'
    });

    $('form').submit(function (e) {
        var areaRange = document.getElementById("sizeSlider").value.split(',');

        var roomRange = document.getElementById("roomSlider").value.split(',');

        var priceRange = document.getElementById("priceSlider").value.split(',');

        var feeRange = document.getElementById("feeSlider").value.split(',');

        var extraData = "&minPrice=" + priceRange[0] + "&maxPrice=" + priceRange[1] + "&minArea=" + areaRange[0] + "&maxArea=" + areaRange[1] + "&minRooms=" + roomRange[0] + "&maxRooms=" + roomRange[1] + "&minFee=" + feeRange[0] + "&maxFee=" + feeRange[1];

          e.preventDefault();
          var data = $(this).serialize() + extraData;
          console.log(data);
          $.ajax({
              url: 'search.php',
              type: 'POST',
              data: data
          })
          .success(function (result) {
              $('#result').html(JSON.stringify(result));
              console.log(result);
          });
    });

    function orderByDesc(value){
      //change the click behaviour for next time
      var order = "DESC";
      document.getElementById(value).setAttribute("onclick","OrderByAsc('"+value+"')");



      console.log(value);
      var cookie = getCookiebyName('session');
      console.log(cookie);
      var decodedCookie = decodeURIComponent(cookie);
      console.log(decodedCookie);
      var cookieValues = decodedCookie.split(",");
      console.log(cookieValues);
      var data = "lan=" + cookieValues[8] + "&type=" + cookieValues[9] + "&minPrice=" + cookieValues[0] + "&maxPrice=" + cookieValues[1] + "&minArea=" + cookieValues[2] + "&maxArea=" + cookieValues[3] + "&minRooms=" + cookieValues[4] + "&maxRooms=" + cookieValues[5] + "&minFee=" + cookieValues[6] + "&maxFee=" + cookieValues[7] + "&col=" + value + "&order=" + order;
      console.log(data);

      $.ajax({
        url: 'search.php',
        type: 'POST',
        data: data
      })
      .success(function (result) {
        $('#result').html(JSON.stringify(result));
        console.log(result);
      });

    }

    function OrderByAsc(value){
      //change the click behaviour for next time
      var order = "ASC";
      document.getElementById(value).setAttribute("onclick","orderByDesc('"+value+"')");

      console.log(value);
      var cookie = getCookiebyName('session');
      console.log(cookie);
      var decodedCookie = decodeURIComponent(cookie);
      console.log(decodedCookie);
      var cookieValues = decodedCookie.split(",");
      console.log(cookieValues);
      var data = "lan=" + cookieValues[8] + "&type=" + cookieValues[9] + "&minPrice=" + cookieValues[0] + "&maxPrice=" + cookieValues[1] + "&minArea=" + cookieValues[2] + "&maxArea=" + cookieValues[3] + "&minRooms=" + cookieValues[4] + "&maxRooms=" + cookieValues[5] + "&minFee=" + cookieValues[6] + "&maxFee=" + cookieValues[7] + "&col=" + value + "&order=" + order;
      console.log(data);

      $.ajax({
        url: 'search.php',
        type: 'POST',
        data: data
      })
      .success(function (result) {
        $('#result').html(JSON.stringify(result));
        console.log(result);
      });

    }


    function getCookiebyName(name){
      var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
      return !!pair ? pair[1] : null;
    };

    </script>

  </body>
</html>
