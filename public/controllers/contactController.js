app.controller("contactController", function($scope, $http, dataFromServer) {

    $scope.contact = {};
    
    $scope.getContact = function() {
        dataFromServer.getContact().then(function(res) {
                $scope.contact = {
                    name: res.data.name,
                    address: {
                        street: res.data.address.street,
                        city: res.data.address.city,
                    },
                    phone: res.data.phone,
                    hours: res.data.hours
                };

            });

    };
});
