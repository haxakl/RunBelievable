document.addEventListener('deviceready', function(){
	// Code au lancement de l'appli

}, false);


var app = angular.module('appTest', ['ngRoute']);


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



app.controller('AppControler', function($scope){
        $scope.liste = [
			{test : 'aaa', testaaa : 'bbb'},
			{test : 'aaa2', testaaa : 'bbb2'},
			{test : 'aaa3', testaaa : 'bbb3'}
		];
	}
);
