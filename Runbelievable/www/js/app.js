/**
 * Fichier contenant les données de l'application mère d'angular.
 *
 */

// Code au lancement de l'appli
document.addEventListener('deviceready', function() {

}, false);

// Création du module angular correspondant à notre application
var app = angular.module('runbelievable', ['ngRoute']);

/**
 *	Configuration des routes de notre application
 *
 */
app.config(function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl : 'partials/home.html'
	}).when('/about', {
		templateUrl : 'partials/about.html'
	}).when('/statistiquesSession', {
		templateUrl : 'partials/statistiquesSession.html'
	}).otherwise({
		redirectTo : '/home'
	});
});

/**
 * La factory, chargée de stocker des données
 * A réutiliser ? Pour l'instant on stock dans le controller principale les informations partagées
 *
 *//*
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
});*/

/**
 *	 Controller principal de l'application.
 *
 */
app.controller('AppControler', function($scope) {
	// Création de l'objet session
	$scope.session = new Session();

	// Gps actif ou non
	$scope.gps_actif = false;
        
        // Pour controler l'acquisition de partout 
        $scope.boucleID = null;

	/**
	 * Cette variable permet d'accéder au Gps dans tous nos scripts Js.
	 * @type Gps
	 */
	$scope.gps = new Gps($scope);
        
        $scope.map = null;
}); 