app.service('BusService', BusService);

function BusService($http, $q, $stateParams) {
    function arrived(data) {
        var def = $q.defer();
        $http.post('http://192.168.99.100/api/bus/'+ $stateParams.userId+'/arrived', data).then(
            function (success) {
                def.resolve(success);
            }
        );
        return def.promise;
    }
    
    function boarded(data) {
        var def = $q.defer();
        $http.post('http://192.168.99.100/api/bus/'+ $stateParams.userId+'/boarded', data).then(
            function (success) {
                def.resolve(success);
            }
        );
        return def.promise;
    }
    
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

    function getPassengersBooked() {
        var def = $q.defer();
        $http.get('http://192.168.99.100/api/bus/'+ $stateParams.userId +'/getPassengers/'+ $stateParams.tripId).then(
            function (success) {
                def.resolve(success);
            }
        );
        return def.promise;
    }

    return {
        arrived: arrived,
        boarded: boarded,
        getDestinations: getDestinations,
        getPassengersBooked: getPassengersBooked
    };
}
