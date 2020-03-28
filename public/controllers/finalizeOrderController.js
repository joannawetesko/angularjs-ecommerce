app.controller("finalizeOrderController",function($scope, $stateParams, $state, dataFromServer) {
    $scope.order = $stateParams.order;
    $scope.basket = $stateParams.basket;
    $scope.total = parseFloat($stateParams.total);

    $scope.finalOrder = {}

    $scope.finalOrder.order = $scope.order; 
    $scope.finalOrder.extras = [];
    $scope.finalOrder.orderInfo = {
        phone: null,
        street: null,
        remarks: null,
    };
    
    $scope.validOrder = false;
    $scope.postFailed = false;

    $scope.extras = [];
    $scope.extrasPopUp = false;

    $scope.getExtras = function() {
        dataFromServer.getExtras().then(function(res) {
            $scope.extras = res.data;
            $scope.extrasPopUp = true;
        });
    };

    $scope.addExtrasToOrder = function(position) {
        var index = -1;        
        $scope.finalOrder.extras.forEach(function(extra) {
            if (extra.id === position.id) {
                index = 0;
            }
        });
        if (index > -1){
            $scope.finalOrder.extras.splice(index, 1);
        }
        else {      
            $scope.finalOrder.extras.push({
                id: position.id,
    		    quantity: 1,
                label: position.label,
                price: position.price
            });
        }
    };

    $scope.updateTotalWithExtras = function() {
        $scope.finalOrder.extras.forEach(function(extra) {
            $scope.total = $scope.total + extra.price;
        });
    }

    $scope.hidePopUp = function() {
        $scope.extrasPopUp = false;
        $scope.updateTotalWithExtras();
        $scope.total.toFixed(2);
    };

    $scope.phoneNumberValidation = function() {
        var phone = $scope.finalOrder.orderInfo.phone;
        var regex = /[0-9]{9}/;
        if (!regex.test(phone)){
            $scope.validOrder = false;
        }
        else {
            $scope.validOrder = true;
        };
    }

    $scope.goToMain = function() {
        $state.go("main");
    };

    $scope.postOrder = function() {
        dataFromServer.postOrder($scope.finalOrder).then(function(res) {
            if (status === 500) {
                $scope.postFailed = true;
            }
            else {
                $state.go("status", {id : res.data.id});
            }
        });
    };

    $scope.getExtras();

});
