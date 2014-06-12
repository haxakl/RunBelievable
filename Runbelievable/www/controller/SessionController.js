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
            if (!$scope.enPause) {
                lancerAcquisition();
            } else {
                startCourse();
            }
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

        // Test si la course est en pause
        if ($scope.forcePause === false && !$scope.donneesTraitees.detecterPause()) {
            if ($scope.enPause) {
                startCourse();
            }

            // On récupère les données du gps
            acquisition_tmp = {
                latitude: $scope.gestionnaires.gps.lastPosition.coords.latitude,
                longitude: $scope.gestionnaires.gps.lastPosition.coords.longitude,
                altitude: $scope.gestionnaires.gps.lastPosition.coords.altitude,
                accuracy: $scope.gestionnaires.gps.lastPosition.coords.accuracy,
                altitudeAccuracy: $scope.gestionnaires.gps.lastPosition.coords.altitudeAccuracy,
                heading: $scope.gestionnaires.gps.lastPosition.coords.heading,
                speed: $scope.gestionnaires.gps.lastPosition.coords.speed,
                timestamp: $scope.gestionnaires.gps.lastPosition.timestamp,
                code: $scope.gestionnaires.gps.lastPosition.code,
                message: $scope.gestionnaires.gps.lastPosition.message,
                acceleration_x: $scope.gestionnaires.accelerometre.lastMesure.x,
                acceleration_y: $scope.gestionnaires.accelerometre.lastMesure.y,
                acceleration_z: $scope.gestionnaires.accelerometre.lastMesure.z,
                donnees: $scope.donneesTraitees.getDonnees()
            };

            // On met à jour l'interface
            $("#vitesseActuelle").text(Math.round($scope.donneesTraitees.vitesseActuelle(), 0));
            $scope.gestionnaires.map.placerPoint(acquisition_tmp);

        } else {
            stopAcquisition();
        }
    }

    /**
     * Lancement course
     */
    function startCourse() {
        $("#sauvegarde").hide();
        $scope.enPause = false;
        $scope.forcePause = false;
        $scope.chronoPrincipal.chronoContinue();
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;
        $scope.gestionnaires.gps.gps_acquisition_actif = true;
    }

    /**
     * Sauvegarde des données
     */
    function saveDonnees(fonc) {
        if ($scope.enLigne && $scope.user.email !== "" && $scope.user.email !== null && $scope.session.getLastDonnees() !== null) {
            $.post("http://runbelievable.honor.es/moteur/modules/sessions/ajax.php", {
                fonction: "saveSession",
                email: $scope.user.email,
                data: JSON.stringify($scope.session)
            }).done(function() {
                fonc();
            }).fail(function() {
                fonc();
            });
        } else {
            fonc();
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
        $("#sauvegarde").show();
//        $scope.refresh();
    }

    /**
     * Méthode permettant de sauvegarder la session dans la liste des sessions  et de le rediriger sur les stats de la session
     */
    $scope.sauvegarderSession = function() {

        $scope.chargement();

        // Ajout de la session dans la liste
        $scope.listeSession.push($scope.session);
        localStorage.setItem("listeSessions", JSON.stringify($scope.listeSession));
        
        saveDonnees(function() {
            // On change les statistiques sur la page prévu à cet effet
            $scope.infoApplication.sessionAfficheeStatistiques = $scope.session;

            // Reset de la session
            $scope.nouvelleSession();
            $scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
            $scope.gestionnaires.gps.gps_acquisition_actif = false;
            $scope.chronoPrincipal.chronoReset();

            // Redirection
            $scope.finchargement();
            location = "#statistiquesSession";
        });
    };

    /**
     * Méthode permettant de sauvegarder la session dans la liste des sessions  et de le rediriger sur les stats de la session
     */
    $scope.sauvegarderSessionPersonnalises = function() {

        $scope.chargement();

        sessionperso = new SessionPersonnalises({
            nom: $("#nom").val(),
            listeEtapes: new Array()
        });

        var etapes = new Array();
        $("#etapes tbody tr").each(function() {
            var tmp = new Object();
            tmp.etape = $(this).find("select").val();
            tmp.secondes = $(this).find("input").val();
            etapes.push(tmp);
        });
        sessionperso.listeEtapes = etapes;

        // Sauvegarde de la session
        $scope.listeSessionPersonnalises.push(sessionperso);
        localStorage.setItem("listeSessionPersonnalises", JSON.stringify($scope.listeSessionPersonnalises));

        // Redirection
        $scope.finchargement();
        location = "#listeSessions";
    };

    // Test si le Gps est allumé    
    $scope.gestionnaires.gps.isEnabled($scope.gestionnaires.map.initializeMap);
}
