(function(){
    "use strict";

    app.controller('passengerController', passengerController);

    function passengerController(PassengerService, $state, $http, $cordovaGeolocation){
        var vm = this;
        var iconBase = 'http://maps.google.com/mapfiles/ms/micons/';
        var icons = {
            bus: {
                icon: iconBase + 'bus.png'
            },
            person: {
                icon: iconBase + 'man.png'
            }
        };

        vm.initMap = initMap;
        vm.searchTrip = searchTrip;

        var options = {timeout: 10000, enableHighAccuracy: true};

        function initMap() {
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                var mapOptions = {
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                vm.map = new google.maps.Map(document.getElementById("passengerMap"), mapOptions);
                vm.feature = [
                    {
                        position:  new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        type: 'person'
                    }
                ];
                angular.forEach(vm.feature, function (feature) {
                    console.log(feature);
                    vm.marker = new google.maps.Marker({
                        position:feature.position,
                        icon: icons[feature.type].icon,
                        map: vm.map
                    }, function(err) {
                        console.err(err);
                    });
                })

                vm.marker.setMap(vm.map);

            }, function(error){

                console.log("Could not get location");
            });

            initSearch();
        }

        function initSearch() {
            PassengerService.initSearch().then(function (response) {
                vm.busList = response.data.bus;
                vm.destinationList = response.data.destination;
            });
        }

        function searchTrip() {
            var data = {
                bus: vm.busCompany,
                destination: vm.destination,
                type: vm.busType

            };
            PassengerService.searchTrip(data).then(function (response) {
                angular.forEach(response.data, function (data) {
                   vm.feature.push({
                        position:  new google.maps.LatLng(parseFloat(data.location_lat), parseFloat(data.location_long)),
                        type: 'bus'
                   });
                });

                angular.forEach(vm.feature, function (feature) {
                    console.log(feature.type);
                    vm.marker = new google.maps.Marker({
                        position:feature.position,
                        icon: icons[feature.type].icon,
                        map: vm.map
                    }, function(err) {
                        console.err(err);
                    });
                    console.log(vm.marker);
                    vm.marker.setMap(vm.map);
                })


            });
        }
    }

})();

