app.controller('loginController', loginController);

function loginController($auth, $state){
  var vm = this;

  vm.login = login;

  function login () {

    var credentials = {
      username: vm.username,
      password: vm.password
    }

    // Use Satellizer's $auth service to login
    $auth.login(credentials).then(function(data) {

      // If login is successful, redirect to the users state
      $state.go('bus.dashboard');
    });

  }
}
