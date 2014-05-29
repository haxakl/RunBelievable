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
    $scope.chronoPause = new Chronometre($scope, "pauseTime");

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

        if ($scope.enPause) {
            $scope.enPause = false;
            $scope.chronoPause.chronoStop();
            
            var pause = new Pause();
            pause.position = $scope.infoApplication.Global.location;
            pause.duree = $scope.chronoPause.getTime();
            
            $scope.chronoPause.chronoReset();
            $scope.session.pauses.push(pause);
        }

        // Lancement du chrono
        $scope.chronoPrincipal.chronoContinue();

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
            detecterPause();
        }, interval_acquisition);
    }

    function detecterPause() {
        if (!$scope.infoApplication.Global.enPause && $scope.infoApplication.Global.location !== null && $scope.infoApplication.Global.lastLocation !== null && $scope.session.listeAcquisitions.length >= 10) {
            if ($scope.vitesseActuelle <= $scope.infoApplication.Global.vitesseLimite) {
                $scope.infoApplication.Global.pauseCounter++;
            }
        }

        if ($scope.infoApplication.Global.pauseCounter === $scope.infoApplication.Global.pauseTrigger) {
            stopAcquisition();
            $scope.infoApplication.Global.pauseCounter = 0;
            $scope.refresh();

        }
    }

    function calculerVitesseActuelle() {

        if ($scope.session.listeAcquisitions.length > 1) {
            var acquisitonActuelle = $scope.session.listeAcquisitions[$scope.session.listeAcquisitions.length - 1];
            var acquisitonPrecedente = $scope.session.listeAcquisitions[$scope.session.listeAcquisitions.length - 2];

            var distance = $scope.gestionnaires.gps.getDistance2Points(acquisitonActuelle.latitude, acquisitonActuelle.longitude, acquisitonPrecedente.latitude, acquisitonPrecedente.longitude);

            var tempsEntre2Points = (acquisitonActuelle.timestamp - acquisitonPrecedente.timestamp) / 1000;

            $scope.vitesseActuelle = 3600 * distance / tempsEntre2Points;
            if (isNaN($scope.vitesseActuelle))
                $scope.vitesseActuelle = 0;

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
     * TODO vider la session actuelle une fois sauvegardé ?
     */
    $scope.sauvegarderSession = function() {
        $scope.listeSession.push($scope.session);

        $scope.infoApplication.sessionAfficheeStatistiques = $scope.session;

        // RAZ de la session
        $scope.nouvelleSession();
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
        $scope.gestionnaires.gps.gps_acquisition_actif = false;
        $scope.chronoPrincipal.chronoReset();

        location = "#statistiquesSession";
    };

    // Test si le Gps est allumé    
    $scope.gestionnaires.gps.isEnabled($scope.gestionnaires.map.initializeMap);

}

// Chronometre

/*var startTime = 0;
 var start = 0;
 var end = 0;
 var diff = 0;
 var timerID = 0;
 function chrono() {
 end = new Date();
 diff = end - start;
 diff = new Date(diff);
 var msec = diff.getMilliseconds();
 var sec = diff.getSeconds();
 var min = diff.getMinutes();
 var hr = diff.getHours() - 1;
 
 if (min < 10) {
 min = "0" + min;
 }
 if (sec < 10) {
 sec = "0" + sec;
 }
 if (msec < 10) {
 msec = "00" + msec;
 }
 document.getElementById("chronotime").innerHTML = hr + ":" + min + ":" + sec;
 timerID = setTimeout("chrono()", 10);
 }
 function chronoStart() {
 start = new Date();
 chrono();
 }
 function chronoContinue() {
 start = new Date() - diff;
 start = new Date(start);
 chrono();
 }
 function chronoReset() {
 // TODO reset le chrono pause
 document.getElementById("chronotime").innerHTML = "0:00:00";
 start = new Date();
 }
 function chronoStopReset() {
 document.getElementById("chronotime").innerHTML = "0:00:00";
 document.chronoForm.startstop.onclick = chronoStart;
 }
 function chronoStop() {
 clearTimeout(timerID);
 }*/