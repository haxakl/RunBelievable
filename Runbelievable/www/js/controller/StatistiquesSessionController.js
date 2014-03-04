/**
* Controler de la page des statistiques de session
*
*/
function StatistiquesSessionController($scope) {
	
	$scope.session.listeDistances = [];
	
	/**
	 * Méthode convertissant un nombre en degrès vers un nombre en radians
 	 * @param {Object} nombre
	 */
	function toRad (nombre) {		
		return nombre * Math.PI / 180; 
	};
	
	
	
	$scope.lissageSession =  function () {
		
		// Rayon de la terre en km
        r = 6366;
		
		// L'ancien point utilisé dans la boucle
		var ancienPoint = null;
		
		// On parcourt les acquisitions effectuées
		for (indice in $scope.session.listeAcquisitions) {
			
			// On recupere le point à parcourir à partir de la liste des acquisitions
			point = $scope.session.listeAcquisitions[indice];
			
			// Si l'ancien point est null (cas de la prmeiere itération de la boucle), on ne fait pas de calcul
			if (ancienPoint == null) {
				ancienPoint = point;
				continue;
			}
			
			//Conversion des latitudes/longitudes en degrés vers du radian
	        lat1 = toRad(ancienPoint.latitude);
	        lon1 = toRad(ancienPoint.longitude);
	        lat2 = toRad(point.latitude);
	        lon2 = toRad(point.longitude);
			
			// On recupere la distance direct entre les deux coordonées GPS
			distance = distanceDirect2Points(lat1, lon1, lat2, lon2);
			
			// On calcule cette distance en km
       		distanceEnKm = distance * r ;
 
 			// On l'ajoute à la liste des distances
 			$scope.session.listeDistances.push(distanceEnKm);
			
			console.log(distanceEnKm);
			
			ancienPoint = point;
		}
	};
	
	
	function distanceDirect2Points(lat1, lon1, lat2, lon2) {		
		return 2*Math.asin(Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)),2)
                + Math.cos(lat1) * Math.cos(lat2) 
                *(Math.pow(Math.sin(((lon1-lon2)/2)), 2))));
	};	
}