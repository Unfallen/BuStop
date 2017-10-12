app.controller('busTripController', busTripController);

function busTripController(BusService, SweetAlert, $http, $interval, $ionicLoading, $q, $rootScope, $scope, $state, $stateParams, $cordovaGeolocation){
    var vm = this;
    var userId = $stateParams.userId;
    vm.driver = "Jose Rizal";
    vm.passengerMarker = [];
    var infoWindow =  new google.maps.InfoWindow({
        content: ''
    });
    updateLocation();
    var interval = $interval(function() {
        updateLocation();
    }, 5000);

    $rootScope.$on('$locationChangeSuccess', function() {
        $interval.cancel(interval);
    });


    if(localStorage.hasTrip == 'false'){
        $state.go('bus.dashboard', {userId: userId});
    }

    var iconBase = 'http://maps.google.com/mapfiles/ms/micons/';
    var icons = {
        bus: {
            icon: iconBase + 'bus.png'
        },
        person: {
            icon: iconBase + 'man.png'
        }
    };

    vm.logout = logout;
    vm.initMap = initMap;
    vm.boarded = boarded;
    vm.arrived = arrived;

    var options = {timeout: 10000, enableHighAccuracy: true};

    function initMap() {
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){

            var mapOptions = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            vm.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            vm.feature = {
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                type: 'bus'
            };
            vm.busMarker = new google.maps.Marker({
                position: vm.feature.position,
                icon: icons[vm.feature.type].icon,
                map: vm.map
            }, function(err) {
                console.err(err);
            });

        }, function(error){
            console.log("Could not get location");
        });
    }

    function updateLocation() {
        BusService.getPassengersBooked().then(function (response) {
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                var position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                vm.busMarker.setPosition(position);
            }, function(error) {
                console.log("Could not get location");
            });
            vm.passengersBooked = response.data.passenger.length;
            vm.bookedBusAvailSeats = response.data.available_seats;
            for (var i = 0; i < vm.passengerMarker.length; i++) {
                vm.passengerMarker[i].setMap(null);
            }
            vm.passengerMarker = [];
            vm.featureResponse = [];
            angular.forEach(response.data.passenger, function (data) {
                vm.featureResponse.push(
                    {
                        position: new google.maps.LatLng(data.location_lat, data.location_long),
                        type: 'person',
                        passenger: data
                    }
                );
            });

            angular.forEach(vm.featureResponse, function (feature, key) {

                var marker = new google.maps.Marker({
                    position: feature.position,
                    icon: icons[feature.type].icon,
                    map: vm.map
                }, function (err) {
                    console.err(err);
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent(setInfoWindowData(key));
                    infoWindow.open(vm.map, marker);
                });

                vm.passengerMarker.push(marker);
            })
        });
    }

    function logout() {
        SweetAlert.swal({
                title: 'Logout',
                text: 'Are you sure you want to log-out?',
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
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });

                    var data = {
                        token: localStorage.satellizer_token
                    };
                    console.log(localStorage.satellizer_token);
                    // Use Satellizer's $auth service to login
                    $http.post('http://192.168.99.100/api/logout', data).then(function(data) {
                        $ionicLoading.hide();
                        localStorage.clear();
                        $state.go('login');
                    });


                } else {
                }
            });
    }

    function setInfoWindowData(index) {
        var html = '<p> Upper: '+ vm.featureResponse[index].passenger.upper_color+' '+ vm.featureResponse[index].passenger.upper + '</p>';
        html += '<p> Lower: '+ vm.featureResponse[index].passenger.lower_color+' '+ vm.featureResponse[index].passenger.lower + '</p>';
        html += '<p> Landmark: '+ vm.featureResponse[index].passenger.landmark+ '</p>';

        return html;
    }

    function boarded() {

        SweetAlert.swal({
                title: 'Boarded',
                text: 'Passenger has boarded?',
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
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var data = {
                        tripId: $stateParams.tripId
                    };

                    BusService.boarded(data).then(function (response) {
                        vm.bookedBusAvailSeats =  response.data.available_seats;
                        $ionicLoading.hide();
                    });
                } else {
            }
        });
    }

    function arrived() {
        SweetAlert.swal({
                title: 'Arrival',
                text: 'Arrived at destination?',
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
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });

                    var data = {
                        tripId: $stateParams.tripId
                    };

                    BusService.arrived(data).then(function (response) {
                        $ionicLoading.hide();
                        localStorage.hasTrip = false;
                        $state.go("bus.dashboard", {userId: userId});
                    });
                } else {
            }
        });

    }

}
