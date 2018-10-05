function myMap() {}

$(() => {
 
  myMap = function() {

        var location = new google.maps.LatLng(59.317, 18.049);

        var mapOptions = {
            center: location,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
   
        new google.maps.Marker({
            position: location,
            map: map
        });
    };

});

    
