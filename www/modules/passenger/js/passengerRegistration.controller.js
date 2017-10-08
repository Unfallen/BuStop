(function(){
    "use strict";

    app.controller('passengerRegistrationController', passengerRegistrationController);

    function passengerRegistrationController($state, $http){
        var vm = this;

        vm.register = register;

        function register() {
            var data = {
                name: vm.name,
                contact_number: vm.contactNumber,
                username: vm.username,
                password: vm.password
            };
            // Use Satellizer's $auth service to login
            $http.post('http://192.168.99.100/api/registerUser', data).then(function(data) {
                if (data.data.response === "success") {
                    $state.go('login');
                }
            });

        }
    }

})();

