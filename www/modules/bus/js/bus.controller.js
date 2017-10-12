app.controller('busController', busController);

function busController(BusService, SweetAlert, $http, $q, $scope, $state, $stateParams, $cordovaGeolocation, $ionicLoading){
    var vm = this;
    var userId = $stateParams.userId;
    var def = $q.defer();
    vm.driver = "Jose Rizal";
    vm.marker = [];

    var iconBase = 'http://maps.google.com/mapfiles/ms/micons/';
    var icons = {
        bus: {
            icon: iconBase + 'bus.png'
        },
        person: {
            icon: iconBase + 'man.png'
        }
    };

    vm.hasTrip = localStorage.hasTrip;
    vm.startTrip = startTrip;
    vm.initMap = initMap;
    vm.getDestinations = getDestinations;
    vm.logout = logout;

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
}
