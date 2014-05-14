/**
 * Fichier contenant les données de l'application mère d'angular.
 */

// Code au lancement de l'appli
document.addEventListener('deviceready', function() {

}, false);

// Création du module angular correspondant à notre application
var app = angular.module('runbelievable', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'view/home.html'
    }).when('/about', {
        templateUrl: 'view/about.html'
    }).when('/statistiquesSession', {
        templateUrl: 'view/statistiquesSession.html'
    }).when('/listeSessions', {
        templateUrl: 'view/listeSessions.html'
    }).when('/sessionEnCours', {
        templateUrl: 'view/sessionEnCours.html'
    }).when('/core', {
        templateUrl: 'view/core.html'
    }).when('/planifierSession', {
        templateUrl: 'view/planificateurSession.html'
    }).otherwise({
        redirectTo: '/home'
    });
});

app.controller('AppControler', function($scope) {
    AppController($scope);
}); 