(function(){
    "use strict";

    app.controller('busRegistrationController', busRegistrationController);

    function busRegistrationController($state, $http, $q){
        var vm = this;
        var def = $q.defer();

        vm.getCompanies = getCompanies;
        vm.register = register;

        function getCompanies() {
            if (!angular.isDefined(vm.companyList)) {
                //return $http.get('http://192.168.99.100/api/authenticate/user');
                $http.get('http://192.168.99.100/api/getCompanies').then(function (success) {
                    def.resolve(success);

                });
                def.promise.then(function (response) {
                    vm.companyList = response.data;
                });
            }
        }

        function register() {
            var data = {
                company: vm.busCompany,
                bus_number: vm.busNumber,
                capacity: vm.busCapacity,
                bus_type: vm.busType,
                driver_name: vm.driverName,
                driver_address: vm.driverAddress,
                driver_age: vm.driverAge,
                username: vm.username,
                password: vm.password
            };
            // Use Satellizer's $auth service to login
            $http.post('http://192.168.99.100/api/registerDriver', data).then(function(data) {
                if (data.data.response === "success") {
                    $state.go('login');
                }
            });

        }
    }

})();

