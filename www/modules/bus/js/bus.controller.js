app.controller('busController', busController);

function busController(BusService, $http, $q, $scope, $stateParams, $cordovaGeolocation){
    var vm = this;
    var userId = $stateParams.userId;
    var def = $q.defer();
    vm.driver = "Jose Rizal";

    vm.startTrip = startTrip;
    vm.initMap = initMap;
    vm.getDestinations = getDestinations;

    getDestinations();

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
    
    function initSearch() {
        
    }

    function getDestinations() {

        BusService.getDestinations().then(function (response) {
            vm.destinations = response.data;
        });
        //console.log(vm.destinations);
    }

    function startTrip() {
        var data = {
            destination : vm.destination,
            capacity: vm.capacity,
            extra_capacity: vm.extra_capacity
        };
        //return $http.get('http://192.168.99.100/api/authenticate/user');
        $http.post('http://192.168.99.100/api/bus/'+ userId +'/newTrip', data).then(function (success) {
            def.resolve(success);

        });
        def.promise.then(function (response) {
            console.log(response.data);
        });
    }
}
