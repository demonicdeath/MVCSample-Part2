app.service("CustomerTestService", function ($http, $rootScope) {

    this.getAllCustomerSectors = function (customerName) {
        return $http({ method: 'GET', url: '/CustomerTest/GetAllCustomerSectors/?id=' + customerName })
            .then(function (response) {
                return response.data;
            }).catch(function (e) {
                console.log("got an error in loading sectors", e);
                throw e;
            });
    };

    this.editCustomerSector = function (customer) {
        return $http.post("/CustomerTest/EditCustomer", customer).then(function (response) {
            return response.data;
        }).catch(function (e) {
            console.log("got an error in customer edit", e);
            throw e;
        });
    };
});