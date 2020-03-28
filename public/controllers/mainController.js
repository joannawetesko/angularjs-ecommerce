app.controller("mainController", function($scope, $http, $state, dataFromServer) {

    $scope.menu = [];
    $scope.allIngredients = [];
    
    $scope.order = [];
    $scope.basket = [];
    $scope.total = 0;

    $scope.popUp = false;
    $scope.currentPizza = { id: "", name: "", ingredients: [], price: "", basicIngredients: [], extraIngredients: [] };

    $scope.getMenu = function() {
        dataFromServer.getMenu().then(function(res) {
            $scope.menu = res.data;
            $scope.editEntry();
        });
    };

    $scope.getAllIngredients = function() {
        dataFromServer.getIngredients().then(function(res) {
            $scope.allIngredients = res.data;
        });
    };

    $scope.editEntry = function() {
        $scope.menu.forEach(function(position) {
            position.extraIngredients = [];
            position.basicIngredients = position.ingredients.slice(0);
            position.ingredients = position.basicIngredients.slice(0);

        });
    };

    $scope.ingredientInList = function(pizza, ingredient) {
        return (pizza.basicIngredients.indexOf(ingredient.id) > -1);
    };

    $scope.updateIngredients = function(pizza, ingredient) {
        var index = pizza.ingredients.indexOf(ingredient.id);     
        if (index > -1){
            pizza.ingredients.splice(index, 1);
            if (!$scope.checkIfBasicIngredient(pizza, ingredient)) {
                var indexExtra = pizza.extraIngredients.indexOf(ingredient.id);
                if (indexExtra > -1) {
                    pizza.extraIngredients.splice(indexExtra, 1);
                }
            }
            $scope.lowerPrice(pizza, ingredient);
        }
        else {        
            pizza.ingredients.push(ingredient.id);
            if (!$scope.checkIfBasicIngredient(pizza, ingredient)) {
                pizza.extraIngredients.push(ingredient.id);
            }
            $scope.risePrice(pizza, ingredient);
        }    
    };

    $scope.checkIfBasicIngredient = function(pizza, ingredient) {
        return pizza.basicIngredients.indexOf(ingredient.id) > -1 ? true : false;
    };

    $scope.risePrice = function(pizza, ingredient) {
        if ($scope.checkIfBasicIngredient(pizza, ingredient)) {}
        else {
            pizza.price = pizza.price + ingredient.price;
            pizza.price.toFixed(2);
        }    
    };

    $scope.lowerPrice = function(pizza, ingredient) {
        if (!$scope.checkIfBasicIngredient(pizza, ingredient)) {
            pizza.price = pizza.price - ingredient.price;
            pizza.price.toFixed(2);
        }
    };

    $scope.startPopUp = function(pizza) {
        $scope.popUp = true;
        //$('#thisdiv').load(document.URL +  ' #thisdiv');
        $scope.currentPizza = JSON.parse(JSON.stringify(pizza));
    };

    $scope.addPizzaToOrder = function(pizza) {
        $scope.popUp = false;
        var flag = true;
        if (pizza.count > 0) {
	        $scope.basket.forEach(function(position) {            
                if (position.name === pizza.name && $scope.arraysEqual(position.extraIngredients,pizza.extraIngredients)) {
                    position.count = position.count + pizza.count;
                    flag = false;
                };
            });
            $scope.order.forEach(function(position) {
                if (position.name === pizza.name) {
                    position.quantity = position.quantity + pizza.count;
                    flag = false;
                };
            });
            if (flag) {       
                var basketPosition = {
                    id: pizza.id,
                    name: pizza.name,            
                    count: pizza.count,
                    price: pizza.price.toFixed(2),
                    ingredients: pizza.ingredients.slice(0),
                    extraIngredients: pizza.extraIngredients.slice(0),
                    basicIngredients: pizza.basicIngredients.slice(0) 
                };
                var orderPosition = {
                    id: pizza.id,
                    extraIngredients: pizza.extraIngredients.slice(0),
                    quantity: pizza.count
                };
                $scope.basket.push(basketPosition);
                $scope.order.push(orderPosition);
            }             
            $scope.sumTotal();
            console.log($scope.currentPizza);
        }
    };

    $scope.removePizzaFromOrder = function(position) {
        var index = $scope.basket.indexOf(position);
        $scope.basket.splice(index, 1);
        $scope.order.splice(index, 1); 
        $scope.sumTotal();
    };

    $scope.sumTotal = function() {
        $scope.total = 0;    
        $scope.basket.forEach(function(position) {
            $scope.total = $scope.total + (position.count * position.price);
        });
        $scope.total = $scope.total.toFixed(2);
    };

    $scope.goToFinalizeOrder = function() {
        $state.go("order", { order: $scope.order, basket: $scope.basket, total: $scope.total });
    };

    $scope.instantOrder = function() {
        $scope.order = [];
        $scope.basket = [];
        $scope.addPizzaToOrder(this.position);    
        $scope.goToFinalizeOrder();
    };

    $scope.arraysEqual = function(arr1, arr2) {
        if(arr1.length !== arr2.length) {
            return false;
        }
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i]) {
                return false;
            }
        }
    return true;
    };

    $scope.getName = function(ingredientId) {
        var name = "";
        $scope.allIngredients.forEach(function(position) {
            if (ingredientId === position.id) {
                name = position.label;
            }
        });
        return name;
    };

    $scope.getAllIngredients();
    $scope.getMenu();
});

