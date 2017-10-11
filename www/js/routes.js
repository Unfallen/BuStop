app.config(function routesConfig($stateProvider, $urlRouterProvider, $authProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');

    $authProvider.baseUrl = 'http://192.168.99.100';
    $authProvider.loginUrl = '/api/login';
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        })
        .state('bus-registration', {
            url: '/admin/bus-registration',
            templateUrl: 'modules/admin/html/bus-registration.html',
            controller: 'busRegistrationController',
            controllerAs: 'vm'
        })
        .state('registration', {
            url: '/passenger/registration',
            templateUrl: 'modules/passenger/html/passenger-registration.html',
            controller: 'passengerRegistrationController',
            controllerAs: 'vm'
        })
        .state('bus',{
            url: '/bus/:userId',
            abstract: true,
            templateUrl: 'templates/bus.html'
        })
        .state('bus.dashboard', {
            url: '/dashboard',
            views: {
                'bus-dashboard': {
                    templateUrl: 'modules/bus/html/dashboard.html',
                    controller: 'busController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('bus.newTrip', {
            url: '/newTrip',
            views: {
                'bus-dashboard': {
                    templateUrl: 'modules/bus/html/newTrip.html',
                    controller: 'busController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('bus.trip', {
            url: '/trip',
            views: {
                'bus-trip': {
                    templateUrl: 'modules/bus/html/trip.html',
                    controller: 'busController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('bus.account', {
            url: '/account',
            views: {
                'bus-account': {
                    templateUrl: 'modules/bus/html/account.html',
                    controller: 'accountController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('passenger',{
            url: '/passenger/:userId',
            abstract: true,
            templateUrl: 'templates/passenger.html'
        })
        .state('passenger.dashboard', {
            url: '/dashboard',
            views: {
                'passenger': {
                    templateUrl: 'modules/passenger/html/dashboard.html',
                    controller: 'passengerController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('passenger.booking', {
            url: '/booking/:tripId',
            views: {
                'passenger': {
                    templateUrl: 'modules/passenger/html/monitorBus.html',
                    controller: 'passengerController',
                    controllerAs: 'vm'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});
