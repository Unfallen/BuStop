app.service('BusService', BusService);

function BusService($http, $q, $stateParams) {
    function getDestinations() {
        //var url = apiUrlProvider.getUrl('logout') + localStorage.getItem('satellizer_token');
        var def = $q.defer();
        $http.get('http://192.168.99.100/api/bus/'+ $stateParams.userId+'/destinations').then(
            function (success) {
                def.resolve(success);
            }
        );
        return def.promise;

    }

    return {
        getDestinations: getDestinations,
    };
}
