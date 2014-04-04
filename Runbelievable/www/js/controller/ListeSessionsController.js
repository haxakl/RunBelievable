/**
 * Controler de la page des listes des sessions
 */
function ListeSessionsController($scope) {

	/**
	 * Méthode permettant d'afficher la session
	 * 
	 * @param {Object} $index L'index de la session dans la liste des sessions stockées
	 */
	$scope.afficherSession = function($index) {
		$scope.sessionAfficheeStatistiques = $scope.listeSession[$index];
		
		
	};
}