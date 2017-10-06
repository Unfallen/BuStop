app.controller('busController', busController);

function busController($scope, $cordovaGeolocation){
    var vm = this;

    vm.driver = "Jose Rizal";

    vm.startTrip = startTrip;
    vm.initMap = initMap;
    var options = {timeout: 10000, enableHighAccuracy: true};

    function initMap() {
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){

            var mapOptions = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            vm.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            vm.marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: vm.map,
                title: 'Holas!'
            }, function(err) {
                console.err(err);
            });
            vm.marker.setMap(vm.map);

        }, function(error){

            console.log("Could not get location");
        });
    }

    function startTrip() {

    }
}
