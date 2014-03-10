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
		calculerStats();
		
		genererStatsResume();
	};
	
	/**
	 * Fonction permettant de calculer les statistiques de la session : 
	 * - la distance parcouru totale
	 * - la durée de la sesion
	 */
	function calculerStats() {
		// Rayon de la terre en km
        r = 6366;
		
		// On remet les statisiques à 0
		$scope.session.distanceParcouru = 0;
		$scope.session.dureeSession = 0;
		
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
			
			// Calcul des stats annexes
			$scope.session.distanceParcouru += distanceEnKm;
			$scope.session.dureeSession += ((point.timestamp - ancienPoint.timestamp)/1000);
			
			// TODO je rajoute ces infos dans le point de la liste d'acquisition
 			$scope.session.listeAcquisitions[indice].distanceEnKm = distanceEnKm;
			$scope.session.listeAcquisitions[indice].duree = ((point.timestamp - ancienPoint.timestamp)/1000);
			
			ancienPoint = point;
		}
	};
	
	/**
	 * Méthode permettant de parcourir la session et de resumé en X points de controles les statistiques 
	 */
	function genererStatsResume() {
		// Le nombre de points de controles
		nombreDePointDeControle = 10;
		
		// Le tableau des stats
		$scope.tableauStats = [];
		
		// Le nombre d'acquisition à parcourir à chaque point de controle
		nbPointParCtrl = $scope.session.listeAcquisitions.length/nombreDePointDeControle;
		
		for (i = 0; i < nombreDePointDeControle; i++) {
			// On recupere un sous tableau contenant les acquisitions relatif à un point de controle
			tab = $scope.session.listeAcquisitions.slice(i*nbPointParCtrl, (i+1)*nbPointParCtrl);
			
			// On parcourt le sous tableau et on fait les stats
			var distanceParcourue = 0;
			var dureeTotale = 0;
			
			for (indice in tab) {
				acquisition = tab[indice];
				
				// Si la distance est Not A number, on continue
				if (isNaN(acquisition.distanceEnKm))
					continue;
				
				distanceParcourue += acquisition.distanceEnKm;
				dureeTotale += acquisition.duree;
			}
			
			// Calcul de la vitesse en km/h
			vitesse =  3600*distanceParcourue/dureeTotale;
			
			// Si la vitesse est NaN, on la met à 0 de base
			if (isNaN(vitesse))
				vitesse = 0;
			
			// On créer l'objet contenant les informations du point de controle
            stats = {
                distance : distanceParcourue,
                duree : dureeTotale,
                vitesseMoyenne : vitesse
            };
            
			// On ajoute les informations
			$scope.tableauStats.push(stats);
			
		}
		
		dessinerGraph();
	}
	
	function dessinerGraph() {
		var r = Raphael("simpleExample");
		var chart = r.linechart(
		    10, 10,      // top left anchor
		    490, 180,    // bottom right anchor
		    [
		      [1, 2, 3, 4, 5, 6, 7],        // red line x-values
		      [3.5, 4.5, 5.5, 6.5, 7, 8]    // blue line x-values
		    ],
		    [
		      [12, 32, 23, 15, 17, 27, 22], // red line y-values
		      [10, 20, 30, 25, 15, 28]      // blue line y-values
		    ],
		    {
		       nostroke: false,   // lines between points are drawn
		       axis: "0 0 1 1",   // draw axes on the left and bottom
		       smooth: true,      // curve the lines to smooth turns on the chart
		       colors: [
		         "#995555",       // the first line is red 
		         "#555599"        // the second line is blue
		       ]
		     });
	}
	
	
	function distanceDirect2Points(lat1, lon1, lat2, lon2) {		
		return 2*Math.asin(Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)),2)
                + Math.cos(lat1) * Math.cos(lat2) 
                *(Math.pow(Math.sin(((lon1-lon2)/2)), 2))));
	};	
}