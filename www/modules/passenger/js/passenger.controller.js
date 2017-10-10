(function(){
    "use strict";

    app.controller('passengerController', passengerController);

    function passengerController(PassengerService, $ionicModal, $compile, $scope, $state, $http, $cordovaGeolocation){
        var vm = this;
        vm.marker = [];
        var infoWindow =  new google.maps.InfoWindow({
            content: ''
        });
        var iconBase = 'http://maps.google.com/mapfiles/ms/micons/';
        var icons = {
            bus: {
                icon: iconBase + 'bus.png'
            },
            person: {
                icon: iconBase + 'man.png'
            }
        };

        vm.addDescription = addDescription;
        vm.bookTrip = bookTrip;
        vm.initMap = initMap;
        vm.searchTrip = searchTrip;
        vm.openModal = openModal;

        var options = {timeout: 10000, enableHighAccuracy: true};

        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        function openModal() {
            $scope.modal.show();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        function initMap() {
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                vm.passenger_lat = position.coords.latitude;
                vm.passenger_long = position.coords.longitude;
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
                    var marker = new google.maps.Marker({
                        position:feature.position,
                        icon: icons[feature.type].icon,
                        map: vm.map
                    }, function(err) {
                        console.err(err);
                    });
                    vm.marker.push(marker);
                })

                //vm.marker.setMap(vm.map);

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
            console.log("here");
            var data = {
                bus: vm.busCompany,
                destination: vm.destination,
                type: vm.busType

            };
            PassengerService.searchTrip(data).then(function (response) {
                for (var i = 0; i < vm.marker.length; i++) {
                    vm.marker[i].setMap(null);
                }
                vm.featureResponse = [];
                vm.marker = [];
                angular.forEach(response.data, function (data) {
                    vm.featureResponse.push({
                        position:  new google.maps.LatLng(parseFloat(data.bus_trip.location_lat), parseFloat(data.bus_trip.location_long)),
                        type: 'bus',
                        tripId: data.bus_trip.id,
                        busId: data.id,
                        name: data.name,
                        busNumber: data.bus_number,
                        availableSeats: data.bus_trip.available_seats
                    });
                });

                angular.forEach(vm.feature, function (feature) {
                    console.log(feature.type);
                    var marker = new google.maps.Marker({
                        position:feature.position,
                        icon: icons[feature.type].icon,
                        map: vm.map
                    }, function(err) {
                        console.err(err);
                    });
                    vm.marker.push(marker);
                });

                angular.forEach(vm.featureResponse, function (feature, key) {
                    console.log(feature.type);
                    var marker = new google.maps.Marker({
                        position:feature.position,
                        icon: icons[feature.type].icon,
                        map: vm.map
                    }, function(err) {
                        console.err(err);
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        infoWindow.setContent(setInfoWindowData(key));
                        infoWindow.open(vm.map, marker);
                    });

                    vm.marker.push(marker);
                })


            });
        }

        function setInfoWindowData(index) {
            var html = '<p>' + vm.featureResponse[index].name + '</p> <br><br>';
            html += '<button ng-click="vm.addDescription('+ index +')">Book Bus</button>';
            var compiled = $compile(html)($scope);

            return compiled[4];
        }

        function addDescription(index) {
            vm.index = index;
            vm.busNumber = vm.featureResponse[index].busNumber;
            vm.availableSeats = vm.featureResponse[index].availableSeats;
            vm.openModal();
        }

        function bookTrip() {
            var data = {
                trip: vm.featureResponse[vm.index].tripId,
                bus: vm.featureResponse[vm.index].busId,
                location_lat: vm.passenger_lat,
                location_long: vm.passenger_long,
                upper: vm.shirt ,
                upper_color:vm.shirtColor,
                lower:vm.lower,
                lower_color:vm.lowerColor,
                landmark: vm.landmark
            }
            PassengerService.bookTrip(data).then(function (response) {
                console.log(response);
            });
        }
    }

})();

