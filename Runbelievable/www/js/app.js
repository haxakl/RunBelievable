document.addEventListener('deviceready', function() {
    // Code au lancement de l'appli

}, false);


var app = angular.module('runbelievable', ['ngRoute']);


/**
 *	Configuration des routes de notre application
 *
 */
app.config(function($routeProvider) {
    $routeProvider
            .when('/home', {templateUrl: 'partials/home.html'})
            .when('/about', {templateUrl: 'partials/about.html'})
            .otherwise({redirectTo: '/home'});
});





/**
* La factory, chargée de stocker des données
*
*/
app.factory('listeAcquisitions', function() {
    var listeAcquisitions = [];
    var itemsService = {};

    itemsService.add = function(item) {
        listeAcquisitions.push(item);
        console.log(listeAcquisitions);
    };
    itemsService.list = function() {
        return listeAcquisitions;
    };

    return itemsService;
});


/**
 *	 Controller principal de l'application.
 *
 */
app.controller('AppControler', function($scope) {
	$scope.listeAcquisitions = [];
});