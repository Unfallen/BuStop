(function(){
    "use strict";

    app.controller('loginController', loginController);

    function loginController(SweetAlert, $auth, $ionicLoading, $state, $http, $rootScope){
        var vm = this;
        var rScope = $rootScope;

        vm.login = login;

        function login () {

            var credentials = {
                username: vm.username,
                password: vm.password
            }
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function(data) {

                // If login is successful, redirect to the users state
                return $http.get('http://192.168.99.100/api/authenticate/user');
            }, function (error) {
                console.log(error);
                SweetAlert.swal("ERROR", error.data, 'error');
            }).then(function (response) {
                console.log(response);
                rScope.currentUser = response.data.user;

                localStorage.setItem('hasTrip', response.data.hasTrip);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('userId', rScope.currentUser.id);
                localStorage.setItem('userName', rScope.currentUser.username);
                localStorage.setItem('userType', rScope.currentUser.passenger_id === 0 ? 'driver' : 'passenger');

                vm.loginError = false;
                vm.loginErrorText = '';
                $ionicLoading.hide();
                if (localStorage.userType === "driver") {
                    if (response.data.hasTrip) {
                        $state.go('bus.trip', {userId: rScope.currentUser.id, tripId: response.data.tripId});
                    } else {

                        $state.go('bus.dashboard', {userId: rScope.currentUser.id});
                    }
                } else {
                    if (response.data.hasTrip) {
                        $state.go('passenger.booking', {userId: rScope.currentUser.id, tripId: response.data.tripId});

                    } else {
                        $state.go('passenger.dashboard', {userId: rScope.currentUser.id});
                    }
                }

            });

        }
    }


    // Define your library strictly...
})();

