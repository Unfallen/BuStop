app.service('AuthService', AuthService);

function AuthService($http, apiUrlProvider, $q) {
  function getLoggedUser() {
    return {
      isAuthenticated: localStorage.getItem('isAuthenticated'),
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
      userType: localStorage.getItem('userType')
    };
  }

  function logout() {
    var url = apiUrlProvider.getUrl('logout') + localStorage.getItem('satellizer_token');
    var def = $q.defer();
    $http.post(url).then(
      function (success) {
        def.resolve(success);
      },+
      function (error) {
        def.reject(error);
      }
    );
    return def.promise;
  }

  return {
    getLoggedUser: getLoggedUser,
    logout: logout
  };
}
