app.service("SectorTestService", function ($http, $rootScope) {

    this.getAllSectors = function () {
        return $http({ method: 'GET', url: '/SectorTest/GetAllSectors' })
            .then(function (response) {
                return response.data;
            }).catch(function (e) {
                console.log("got an error in loading sectors", e);
                throw e;
            });
    };
});