(function(){
    "use strict";

    app.controller('passengerController', passengerController);

    function passengerController(PassengerService, SweetAlert, $ionicModal, $compile, $interval, $scope, $state, $stateParams, $http, $cordovaGeolocation){
        var vm = this;
        vm.hasTrip = localStorage.hasTrip;
        vm.marker = [];
        if (vm.hasTrip == 'true') {
            $interval(function() {
                updateBusLocation();
            }, 3000);
        }

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
        vm.checkIfHasTrip = checkIfHasTrip;
        vm.initMap = initMap;
        vm.searchTrip = searchTrip;
        vm.openModal = openModal;
        vm.cancelBooking = cancelBooking;
        vm.boarded = boarded;

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

        function updateBusLocation() {
            PassengerService.getBooking().then(function (response) {
                vm.bookedBusNumber = response.data.bus.bus_number;
                vm.bookedBusAvailSeats = response.data.available_seats;
                var position = new google.maps.LatLng(parseFloat(response.data.location_lat), parseFloat(response.data.location_long));
                vm.busMarker.setPosition(position);
            });
        }

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
                });


                if (vm.hasTrip == 'true') {
                    PassengerService.getBooking().then(function (response) {
                        vm.bookedBusNumber = response.data.bus.bus_number;
                        vm.bookedBusAvailSeats = response.data.available_seats;
                        var position = new google.maps.LatLng(parseFloat(response.data.location_lat), parseFloat(response.data.location_long));
                        vm.busMarker = new google.maps.Marker({
                            position:position,
                            icon: icons['bus'].icon,
                            map: vm.map
                        }, function(err) {
                            console.err(err);
                        });
                    });
                }

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
                    console.log(data);
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
            console.log(vm.featureResponse);
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

        function checkIfHasTrip() {
            return vm.hasTrip;
        }

        function cancelBooking() {
            SweetAlert.swal({
                    title: 'Cancel Booking',
                    text: 'Are you sure you want to cancel Booking?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#DD6B55',
                    closeOnConfirm: true,
                    closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    PassengerService.cancelBooking($stateParams.userId).then( function(data){
                        localStorage.hasTrip = false;
                        vm.hasTrip = false;
                        $state.go('passenger.dashboard', {userId: $stateParams.userId});
                    });
                } else {
                    angular.element('button').tooltip('hide');
                }
            });
        }

        function boarded () {

        }

        function cancelControl(controlDiv, map) {

            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '38px';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = 'Center Map';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function() {
                map.setCenter(chicago);
            });

        }
    }

})();

