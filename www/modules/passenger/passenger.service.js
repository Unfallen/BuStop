app.service('PassengerService', PassengerService);

function PassengerService($http, $q, $stateParams) {

    function bookTrip(data) {
        var def = $q.defer();
        $http.post('http://192.168.99.100/api/passenger/'+ $stateParams.userId+'/bookTrip', data).then(
            function (success) {
                def.resolve(success);
            }
        )
        return def.promise;
    }

    function initSearch() {
        var def = $q.defer();
        $http.get('http://192.168.99.100/api/passenger/'+ $stateParams.userId+'/initSearch').then(
            function (success) {
                def.resolve(success);
            }
        );
        return def.promise;
    }

    function searchTrip(data) {
        var def = $q.defer();
        $http.post('http://192.168.99.100/api/passenger/'+ $stateParams.userId+'/searchTrip', data).then(
            function (success) {
                def.resolve(success);
            }
        )
        return def.promise;
    }

    return {
        bookTrip: bookTrip,
        initSearch: initSearch,
        searchTrip: searchTrip
    };
}
