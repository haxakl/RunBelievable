/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope) {

	var interval_acquisition = 1000;
	var boucleID = null;

	// Enum pour les textes dispo pour le bouton (à déplacer dans un endroit approprié dans le futur)
	var dico_bouton_acquisition = {
		STOP : "Arrêter l'acquisition",
		START : "Démarrer l'acquisition",
		RESTART : "Redémarrer l'acquisition"
	};

	// Texte par défaut
	if($scope.session.listeAcquisitions.length == 0)
		$scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
	else if($scope.gps.gps_acquisition_actif)
		$scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;
	else
		$scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;


	/**
	 * Permet de modifier l'état du bouton (texte pour l'instant)
	 */
	$scope.clickAcquisition = function() {
		if ($scope.gps.gps_acquisition_actif) {
			stopAcquisition();
		} else {
			lancerAcquisition();
		}
	};

	/**
	 *   Permet de verifier si le GPS fonctionne correctement sur le mobile.
	 */
	function verifierGPS() {
		$scope.gps.modifIcone("info");
		$scope.gps.isEnabled();

	}

	/**
	 * Méthode permettant d'ajouter une acquisition de position GPS.
	 * @param {type} item Nouvelles données
	 */
	function ajouterAcquisitionGPS(item) {
		if (item === null)
			return;

		$scope.session.listeAcquisitions.push(item);

		// Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	}

	/**
	 * Démarre l'acquisition
	 */
	function lancerAcquisition() {

		// Test si le Gps n'est pas actif on ne fait rien, et si il n'est pas deja démarré
		if (!$scope.gps_actif || $scope.gps.gps_acquisition_actif) {
			return false;
		}
		$scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;

		// Acquisition démarée
		$scope.gps.gps_acquisition_actif = true;

		// Boucle de récuperation des données
		boucleID = setInterval(function() {
			$scope.gps.getAcquisition(ajouterAcquisitionGPS);
		}, interval_acquisition);
	};

	/**
	 * Arrête l'acquisition
	 */
	function stopAcquisition() {
		// Test si le Gps n'est pas actif on ne fait rien, et si l'acquisition n'est pas deja arêtée
		if (!$scope.gps_actif || !$scope.gps.gps_acquisition_actif) {
			return false;
		}

		$scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;

		// On arrete l'acquisition
		clearInterval(boucleID);

		// Acquisition arêtée
		$scope.gps.gps_acquisition_actif = false;

	};

	// Test si le Gps est allumé
	verifierGPS();
}