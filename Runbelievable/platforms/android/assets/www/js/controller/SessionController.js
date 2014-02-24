function SessionController($scope) {

	$scope.liste = [
			{test : 'aaa', testaaa : 'bbb'},
			{test : 'aaa2', testaaa : 'bbb2'},
			{test : 'aaa3-', testaaa : 'bbb3-'},
			{test : 'aaa4', testaaa : 'bbb4'}
	];

	$scope.acquisition=function() {
		//console.log($scope.liste[0].test);

		alert('test');

		// onSuccess Callback
		// This method accepts a Position object, which contains the
		// current GPS coordinates
		//
		var onSuccess = function(position) {
		    alert('Latitude: '          + position.coords.latitude          + '\n'/* +
		          'Longitude: '         + position.coords.longitude         + '\n' +
		          'Altitude: '          + position.coords.altitude          + '\n' +
		          'Accuracy: '          + position.coords.accuracy          + '\n' +
		          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		          'Heading: '           + position.coords.heading           + '\n' +
		          'Speed: '             + position.coords.speed             + '\n' +
		          'Timestamp: '         + position.timestamp                + '\n'*/);

		    /*
		   	$scope.geolocation = [{
				latitude:  position.coords.latitude,
		        longitude: position.coords.longitude,
		        altitude: position.coords.altitude,
		        accuracy: position.coords.accuracy,
		        altitudeAccuracy: position.coords.altitudeAccuracy,
		        heading: position.coords.heading,
		        speed: position.coords.speed,
		        timestamp: position.timestamp
		   	}];*/
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
		    alert('code: '    + error.code    + '\n' +
		          'message: ' + error.message + '\n');

		    $scope.error = [{
		    	code: error.code,
		    	message: error.message
		    }];
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		alert('fin test');
	}
}