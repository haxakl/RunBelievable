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
	// Création de la liste des acquisitions GPS
	$scope.listeAcquisitions = [];

	// Gps actif ou non
	$scope.gps_actif = false;

	/**
	 * Cette variable permet d'accéder au Gps dans tous nos scripts Js.
	 * @type Gps
	 */
	$scope.gps = new Gps($scope);
}); 