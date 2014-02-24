function SessionController($scope) {

	$scope.liste = [
			{test : 'aaa', testaaa : 'bbb'},
			{test : 'aaa2', testaaa : 'bbb2'},
			{test : 'aaa3-', testaaa : 'bbb3-'},
			{test : 'aaa4', testaaa : 'bbb4'}
	];

	$scope.test=function() {
		console.log($scope.liste[0].test);
	}
}