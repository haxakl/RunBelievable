/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope) {

    var interval_acquisition = 1000;

    $scope.location = null;
    


    // Enum pour les textes dispo pour le bouton (à déplacer dans un endroit approprié dans le futur)
    var dico_bouton_acquisition = {
        STOP: "Arrêter l'acquisition",
        START: "Démarrer l'acquisition",
        RESTART: "Redémarrer l'acquisition"
    };

    // Texte par défaut
    if ($scope.session.listeAcquisitions.length === 0)
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
    else if ($scope.gps.gps_acquisition_actif)
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;
    else
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;


    /**
     * Permet de modifier l'état du bouton (texte pour l'instant)
     */
    $scope.clickAcquisition = function() {
        // TODO remplacer ce if par un ng-show sur le bouton acquisition (j'ai essayé mais il veut pas - Chris)
        if (!$scope.gps_actif) {
            $scope.afficherAlerte("Erreur", "Le Gps n'est pas démarré", "danger");
        }

        if ($scope.gps.gps_acquisition_actif) {
            stopAcquisition();
        } else {
            lancerAcquisition();
        }
    };


    $scope.localiser = function() {
        $scope.gps.getAcquisition(placerPoint)
    }

    /**
     * Méthode permettant de localiser l'utilisateur
     * @param {type} item Nouvelles données
     */
    function placerPoint(item) {

        if (!$scope.gps_actif || item === null) {
            return;
        }

        // maj la location
        $scope.location = new google.maps.LatLng(item.latitude, item.longitude);

        // Si la carte n'est pas initialisée, l'initialiser, sinon maj la location
        if ($scope.map !== null) {
            $scope.majLocalisation();
        }
        else {
            $scope.initializeMap();
        }

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.majLocalisation = function() {
        var marker = new google.maps.Marker({
            position: $scope.location,
            map: $scope.map,
            title: 'FOUND YO SORRY ASS !!'
        });
        
        $scope.map.panTo($scope.location);
    }
        
    // Affiche la carte
    $scope.initializeMap = function() {

        var item = new google.maps.LatLng($scope.location.latitude, $scope.location.longitude);

        var mapOptions = {
            center: $scope.location,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: $scope.location,
            map: $scope.map,
            title: 'FOUND YO SORRY ASS !!'
        });
    }

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
        // on push seulement si gps en route et item != null
        if (!$scope.gps_actif || !$scope.gps.gps_acquisition_actif || item === null) {
            return;
        }

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
        $scope.boucleID = setInterval(function() {

            if (!$scope.gps_actif || !$scope.gps.gps_acquisition_actif) {
                // On arrete l'acquisition
                clearInterval($scope.boucleID);
            }
            $scope.gps.getAcquisition(ajouterAcquisitionGPS);
        }, interval_acquisition);
    }


    /**
     * Arrête l'acquisition
     */
    function stopAcquisition() {
        // Test si le Gps n'est pas actif on ne fait rien, et si l'acquisition n'est pas deja arêtée
        if (!$scope.gps_actif || !$scope.gps.gps_acquisition_actif) {
            return false;
        }

        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;


        // Acquisition arêtée
        $scope.gps.gps_acquisition_actif = false;

    }


    // Test si le Gps est allumé
    verifierGPS();

}