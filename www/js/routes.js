app.config(function routesConfig($stateProvider, $urlRouterProvider, $authProvider) {

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
    .state('bus',{
      url: '/bus',
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
    .state('bus.trip', {
      url: '/trip',
      views: {
        'bus-trip': {
          templateUrl: 'modules/bus/html/trip.html',
          controller: 'busController',
          controllerAs: 'vm'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
