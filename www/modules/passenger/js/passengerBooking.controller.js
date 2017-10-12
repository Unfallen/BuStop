
(function(){
    "use strict";

    app.controller('passengerBookingController', passengerBookingController);

    function passengerBookingController(PassengerService, SweetAlert, $ionicModal, $compile, $interval, $rootScope, $scope, $state, $stateParams, $http, $cordovaGeolocation){
        var vm = this;
        vm.hasTrip = localStorage.hasTrip;
        vm.marker = [];

        var infoWindow =  new google.maps.InfoWindow({
            content: ''
        });
        var interval = $interval(function() {
            updateBusLocation();
        }, 3000);

        $rootScope.$on('$locationChangeSuccess', function() {
            $interval.cancel(interval);
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
        vm.initMap = initMap;
        vm.cancelBooking = cancelBooking;
        vm.boarded = boarded;

        var options = {timeout: 10000, enableHighAccuracy: true};

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
                vm.map = new google.maps.Map(document.getElementById("monitorBusMap"), mapOptions);
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

                        //$state.transitionTo('passenger.dashboard', {userId: $stateParams.userId}, {reload: true, notify:true});
                        //$state.reload('passenger.dashboard');
                    });
                } else {
                    angular.element('button').tooltip('hide');
                }
            });
        }

        function boarded () {

        }

    }

})();


