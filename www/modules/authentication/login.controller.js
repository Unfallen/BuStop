app.controller('loginController', loginController);

function loginController($auth, $state, $http, $rootScope){
  var vm = this;
  var rScope = $rootScope;

  vm.login = login;

  function login () {

    var credentials = {
      username: vm.username,
      password: vm.password
    }

    // Use Satellizer's $auth service to login
    $auth.login(credentials).then(function(data) {

      // If login is successful, redirect to the users state
      return $http.get('http://192.168.99.100/api/authenticate/user');
    }, function (error) {
      SweetAlert.swal(constantString.errorTitle, error.data.error, 'error');
    }).then(function (response) {
      console.log(response);
      rScope.currentUser = response.data.user;

      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('userId', rScope.currentUser.id);
      localStorage.setItem('userName', rScope.currentUser.username);
      localStorage.setItem('userType', rScope.currentUser.passenger_id === 0 ? 'driver' : 'passenger');

      vm.loginError = false;
      vm.loginErrorText = '';

      $state.go('bus.dashboard');
    });

  }
}
