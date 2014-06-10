/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope) {

    var interval_acquisition = 1000;
    $scope.vitesseActuelle = 0;
    $scope.session.dureeSession = 0;
    $scope.session.calorie = 0;
    // Les 2 chronomètres servant à la session
    $scope.chronoPrincipal = new Chronometre($scope, "chronotime");
    $scope.chronoPause = new Chronometre($scope);
    $scope.forcePause = false;

    // TODO Enum pour les textes dispo pour le bouton (à déplacer dans un endroit approprié dans le futur) 
    var dico_bouton_acquisition = {
        STOP: "Interrompre l'acquisition",
        START: "Démarrer",
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
            $scope.forcePause = true;
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

        saveSession();

        $scope.forcePause = false;
        startCourse();

        // Boucle de récuperation des données
        $scope.boucleID = setInterval(function() {
            boucleCourse();
        }, interval_acquisition);
        
    }

    /**
     * Boucle de la course
     */
    function boucleCourse() {

        $scope.gestionnaires.gps.getAcquisition($scope.gestionnaires.map.placerPoint);

        saveDonnees();

        // Test si la course est en pause
        if ($scope.forcePause === false && !$scope.donneesTraitees.detecterPause()) {
            if ($scope.enPause) {
                startCourse();
            }

            $("#vitesseActuelle").text(Math.round($scope.donneesTraitees.vitesseActuelle(), 0));

            $scope.donneesTraitees.boucle();
        } else {
            stopAcquisition();
        }
    }

    /**
     * Lancement course
     */
    function startCourse() {
        $scope.enPause = false;
        $scope.chronoPrincipal.chronoContinue();
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;
        $scope.gestionnaires.gps.gps_acquisition_actif = true;
    }

    /**
     * Sauvegarde des données
     */
    function saveDonnees() {
        if ($scope.user.email !== "" && $scope.user.email !== null && $scope.session.getLastDonnees() !== null) {
            $.post("http://runbelievable.netai.net/moteur/modules/donnees/ajax.php", {
                fonction: "saveDonnees",
                reference: $scope.session.reference,
                data: JSON.stringify($scope.session.getLastDonnees())
            });
        }
    }

    /**
     * Sauvegarde la session
     */
    function saveSession() {
        if ($scope.user.email !== "" && $scope.user.email !== null && !$scope.session.save) {
            $.post("http://runbelievable.netai.net/moteur/modules/sessions/ajax.php", {
                fonction: "newSession",
                reference: $scope.session.reference,
                email: $scope.user.email
            });
            $scope.session.save = true;
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

        $scope.chronoPrincipal.chronoStop();
        $scope.enPause = true;
        $scope.chronoPause.chronoStart();
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;
        // Acquisition arêtée
        $scope.gestionnaires.gps.gps_acquisition_actif = false;
        // Recentrer sur dernière pos connue
        $scope.gestionnaires.map.centrer($scope.infoApplication.Global.location);
        $scope.refresh();
    }

    /**
     * Méthode permettant de sauvegarder la session dans la liste des sessions  et de le rediriger sur les stats de la session
     */
    $scope.sauvegarderSession = function() {

        // Ajout de la session dans la liste
        $scope.listeSession.push(JSON.stringify($scope.session));
        $scope.sauvegarder();
        // On change les statistiques sur la page prévu à cet effet
        $scope.infoApplication.sessionAfficheeStatistiques = $scope.session;
        // Reset de la session
        $scope.nouvelleSession();
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
        $scope.gestionnaires.gps.gps_acquisition_actif = false;
        $scope.chronoPrincipal.chronoReset();
        // Redirection
        location = "#statistiquesSession";
    };

    // Test si le Gps est allumé    
    $scope.gestionnaires.gps.isEnabled($scope.gestionnaires.map.initializeMap);
}
