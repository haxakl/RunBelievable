/**
 * Fichier contenant les données de l'application mère d'angular.
 */

// Code au lancement de l'appli
document.addEventListener('deviceready', function() {

}, false);

// Création du module angular correspondant à notre application
var app = angular.module('runbelievable', ['ngRoute']);

app.config(function($routeProvider) {
    
    // Accueil
    $routeProvider.when('/home', {
        templateUrl: 'view/home.html'
    
    // Gestion des comptes
    }).when('/compte', {
        templateUrl: 'view/comptes/accueil.html'
    }).when('/profile', {
        templateUrl: 'view/profil.html'
    }).when('/compte/local', {
        templateUrl: 'view/comptes/local.html'
    }).when('/compte/inscription', {
        templateUrl: 'view/comptes/inscription.html'
    }).when('/compte/login', {
        templateUrl: 'view/comptes/login.html'
    
    // Sessions
    }).when('/statistiquesSession', {
        templateUrl: 'view/statistiquesSession.html'
    }).when('/listeSessions', {
        templateUrl: 'view/listeSessions.html'
    }).when('/planifierSession', {
        templateUrl: 'view/planificateurSession.html'
    }).when('/sessionEnCours', {
        templateUrl: 'view/sessionEnCours.html'
    
    // Core
    }).when('/core', {
        templateUrl: 'view/core.html'
    }).when('/planifierSession', {
        templateUrl: 'view/planificateurSession.html'
    }).when('/profil', {
        templateUrl: 'view/profil.html'   
    }).when('/profilAllure', {
        templateUrl: 'view/profilAllure.html' 
    }).when('/profilCardio', {
        templateUrl: 'view/profilCardio.html'
    }).when('/profilEtatCivil', {
        templateUrl: 'view/profilEtatCivil.html'
    }).when('/profilExplosivite', {
        templateUrl: 'view/profilExplosivite.html'      
    }).when('/profilHabitudes', {
        templateUrl: 'view/profilHabitudes.html'     
    }).when('/profilMensuration', {
        templateUrl: 'view/profilMensuration.html'     
    }).when('/profilPerformance', {
        templateUrl: 'view/profilPerformance.html' 
        
    // Aucune route
    }).otherwise({
        redirectTo: '/home'
    });
    
});

app.controller('AppControler', function($scope, $location) {
    AppController($scope, $location);
});
