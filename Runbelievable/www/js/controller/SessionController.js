/**
* Controler d'une session.
*
*/
function SessionController($scope) {

    var gps = new Gps(this);

	/**
	* Méthode permettant d'ajouter acquisition de position GPS
	*/
    this.ajouterAcquisitionGPS = function(item) {
    	$scope.listeAcquisitions.push(item);

    	// Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
    	if(!$scope.$$phase) {
			$scope.$apply();
		}
    }
}