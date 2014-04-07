/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope) {

    var interval_acquisition = 1000;

    $scope.vitesseActuelle = 0;
    $scope.session.dureeSession = 0;
    $scope.session.calorie = 0;

    // TODO Enum pour les textes dispo pour le bouton (à déplacer dans un endroit approprié dans le futur) 
    var dico_bouton_acquisition = {
        STOP: "Intérrompre l'acquisition",
        START: "Démarrer l'acquisition",
        RESTART: "Redémarrer l'acquisition"
    };

    // Texte par défaut
    if ($scope.session.listeAcquisitions.length === 0)
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
    else if ($scope.gestionnaires.gps.gps_acquisition_actif)
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;
    else
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;

    $scope.clickAcquisition = function() {
        if ($scope.gestionnaires.gps.gps_acquisition_actif) {
            stopAcquisition();
        } else {
            lancerAcquisition();
        }
    };

    

    /**
     * Démarre l'acquisition
     */
    function lancerAcquisition() {

        // Test si le Gps n'est pas actif on ne fait rien, et si il n'est pas deja démarré
        if (!$scope.gestionnaires.gps.actif || $scope.gestionnaires.gps.gps_acquisition_actif) {
            return false;
        }
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;

        // Acquisition démarée
        $scope.gestionnaires.gps.gps_acquisition_actif = true;

        // Boucle de récuperation des données
        $scope.boucleID = setInterval(function() {

            if (!$scope.gestionnaires.gps.actif || !$scope.gestionnaires.gps.gps_acquisition_actif) {
                // On arrete l'acquisition
                clearInterval($scope.boucleID);
            }
            $scope.gestionnaires.gps.getAcquisition($scope.gestionnaires.map.placerPoint);

            calculerVitesseActuelle();
        }, interval_acquisition);
    }

    function calculerVitesseActuelle() {

        if ($scope.session.listeAcquisitions.length > 1) {
            var acquisitonActuelle = $scope.session.listeAcquisitions[$scope.session.listeAcquisitions.length - 1];
            var acquisitonPrecedente = $scope.session.listeAcquisitions[$scope.session.listeAcquisitions.length - 2];

            var distance = $scope.gestionnaires.gps.getDistance2Points(acquisitonActuelle.latitude, acquisitonActuelle.longitude, acquisitonPrecedente.latitude, acquisitonPrecedente.longitude);

            var tempsEntre2Points = (acquisitonActuelle.timestamp - acquisitonPrecedente.timestamp) / 1000;

            $scope.vitesseActuelle = 3600 * distance / tempsEntre2Points;
            $("#vitesseActuelle").text(Math.round($scope.vitesseActuelle, 0));
        }
    }

    /**
     * Arrête l'acquisition
     */
    function stopAcquisition() {
        // Test si le Gps n'est pas actif on ne fait rien, et si l'acquisition n'est pas deja arêtée
        if (!$scope.gestionnaires.gps.actif || !$scope.gestionnaires.gps.gps_acquisition_actif) {
            return false;
        }

        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;

        // Acquisition arêtée
        $scope.gestionnaires.gps.gps_acquisition_actif = false;

        // Recentrer sur dernière pos connue
        $scope.gestionnaires.map.centrer($scope.infoApplication.Global.location);


    }   

    /**
     * Méthode permettant de sauvegarder la session dans la liste des sessions  et de le rediriger sur les stats de la session
     */
    $scope.sauvegarderSession = function() {
        $scope.listeSession.push($scope.session);

        $scope.infoApplication.sessionAfficheeStatistiques = $scope.session;

        location = "#statistiquesSession";

    };

    // Test si le Gps est allumé    
    $scope.gestionnaires.gps.isEnabled($scope.gestionnaires.map.initializeMap);

}