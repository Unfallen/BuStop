app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location) {
    console.log('DENY');
    $rootScope.$on('$routeChangeStart', function (event) {
        console.log('DENY');
        var loggedUser = AuthService.getLoggedUser();
        if (!loggedUser.isAuthenticated()) {
            console.log('DENY');
            event.preventDefault();
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
            $location.path('/home');
        }
    });
}]);
