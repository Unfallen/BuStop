app.run(function ($rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        //print here
        if (!localStorage.getItem('isAuthenticated')) {
            $location.url('/login');
        } else {
            if ( toState.name === "login") {
                event.preventDefault();
            }
        }
    });
});
