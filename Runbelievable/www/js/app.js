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
 *	 Controller principal de l'application.
 *
 */
app.controller('AppControler', function($scope) {
}
);
