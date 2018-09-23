var app = angular.module("app", ["datatables", "ui.bootstrap", "ngIdle"]);

app.config(["$httpProvider", function ($httpProvider) {

    // Register interceptors service
    $httpProvider.interceptors.push('interceptors');
}]);

app.factory("interceptors", [function () {

    return {
        'request': function (request) {
            if (window.location.hostname !== "localhost") {
                var baseElement = angular.element(document.querySelector('base'));

                if (baseElement.length > 0) {
                    request.url = baseElement[0].href + request.url;
                }
            }
            return request;
        }
    };
}]);


