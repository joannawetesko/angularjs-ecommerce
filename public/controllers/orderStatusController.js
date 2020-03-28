app.controller("orderStatusController", function($scope, $http, $stateParams, $window, dataFromServer){
    $scope.order = {};
    $scope.id = $stateParams.id;
    $scope.message = "";

    $scope.getOrder = function(id) {
        dataFromServer.getOrder(id).then(function(res) {
                $scope.order = {
                    id: res.data.id,
                    estimated: String(new Date(res.data.estimated)).slice(16,21)
                };
                resetMessage(res.data.status);          
            });

    };

    var socket = new WebSocket("ws://localhost:8080/order/" + $scope.id);

    socket.onerror = function (error) {
	  alert("Coś poszło nie tak!");
	};
	
    socket.onmessage = function (event) {
	 	resetMessage(event.data.status);
        $scope.reloadRoute();
	};

    function resetMessage(status){
		switch(status) {
			case 0:
				$scope.message = "Przyjęliśmy zamówienie";
				break;
			case 1:
				$scope.message = "Przygotowujemy Twoje zamówienie...";
				break;
			case 2:
				$scope.message = "Twoja pizza już jedzie";
				break;
			case 3: 
				$scope.message = "Twoje zamówienie powinno zostać dostarczone";
				break;
		}
	};	

    $scope.reloadRoute = function() {
        $window.location.reload();
    }

    $scope.$on("$destroy", function(){
        socket.close();
    });
    
    $scope.getOrder($scope.id);
});
