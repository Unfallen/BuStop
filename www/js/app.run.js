app.run(function ($rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        //print here
        if (!localStorage.getItem('isAuthenticated')) {
            if(toState.name !== "bus-registration" && toState.name !== 'registration') {

                $location.url('/login');
            }
        } else {
            if ( toState.name === "login" || toState.name === "bus-registration" || toState.name === 'registration') {
                if (fromState.name === "") {
                    $location.url('/bus/'+ localStorage.getItem('userId') +'/dashboard' )
                } else {
                    event.preventDefault();
                }
            }
        }
    });
});
