(function(){
    "use strict";

    app.controller('accountController', accountController);

    function accountController($state, $stateParams, $http){
        var vm = this;
        var userId = $stateParams.userId;

        vm.logout = logout;

        function logout() {
            var data = {
                token: localStorage.satellizer_token
            };
            console.log(localStorage.satellizer_token);
            // Use Satellizer's $auth service to login
            $http.post('http://192.168.99.100/api/logout', data).then(function(data) {
                localStorage.clear();
                $state.go('login');
            });

        }
    }

})();

