var app = angular.module('PizzeriaApp', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("main", {
            url: "/",
            templateUrl: "public/main.html",
            controller: "mainController"
        })
        .state("contact", {
            url: "/contact",
            templateUrl: "public/contact.html",
            controller: "contactController"
        })
        .state('order', {
    	    url: "/order",
            templateUrl: "public/finalizeOrder.html",
            controller: "finalizeOrderController",
            params: {
                order: null,
                basket: null,
                total: 0
            }
        })
        .state('status', {
            url: "/order/:id",
            templateUrl: "public/orderStatus.html",
            controller: "orderStatusController",
            params: {
                id : null
            }
        });
});

app.service("dataFromServer", function($http) {
    
    return {
                getContact: function() {
                    return $http.get("/contact").then(function(res) {
                        return res;
                    });
                },

                getMenu: function() {
                    return $http.get("/menu").then(function(res) {
                        return res;
                    });
                },

                getIngredients: function() {
                    return $http.get("/ingredients").then(function(res) {
                        return res;
                    });
                },

                getExtras: function() {
                    return $http.get("/extras").then(function(res) {
                        return res;
                    });
                },

                postOrder: function(order) {
                    return $http.post("/order", order).then(function(res) {                        
                        return res;
                    });
                },
        
                getOrder: function(id) {
                    return $http.get("/order/" + id).then(function(res) {
                        return res;
                    });
                }
    };               
});

app.filter('showIngredientsNames', function () {
        return function (pizza, ingredient) {
            return pizza.basicIngredients.indexOf(ingredient.id) > -1 ? true : false;
        };
});
