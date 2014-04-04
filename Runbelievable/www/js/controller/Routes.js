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
        templateUrl: 'partials/home.html'
    }).when('/about', {
        templateUrl: 'partials/about.html'
    }).when('/statistiquesSession', {
        templateUrl: 'partials/statistiquesSession.html'
    }).when('/listeSessions', {
        templateUrl: 'partials/listeSessions.html'
    }).when('/planifierSession', {
        templateUrl: 'partials/planificateurSession.html'
    }).otherwise({
        redirectTo: '/home'
    });
});

app.factory('Global', function() {
    return {
        map: null,
        location: null,
        lastLocation : null        
    };
});

/**
 *	 Controller principal de l'application.
 *
 */
app.controller('AppControler', function($scope) {
    AppController($scope);
}); 