/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope, Global) {

    var interval_acquisition = 1000;


    // TODO Enum pour les textes dispo pour le bouton (à déplacer dans un endroit approprié dans le futur) 
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
        if ($scope.gps.gps_acquisition_actif) {
            stopAcquisition();
        } else {
            lancerAcquisition();
        }
    };



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

        // maj la position
        var marker = new google.maps.Marker({
            position: $scope.location,
            map: Global.map,
            title: 'FOUND YO SORRY ASS !!'
        });

        // push dans liste acquisitions
        $scope.session.listeAcquisitions.push(item);

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }



    /**
     *   Permet de verifier si le GPS fonctionne correctement sur le mobile.
     */
    function verifierGPS(hook) {
        $scope.gps.modifIcone("info");

        // Le hook permet d'éxécuter une action après vérification du gps
        $scope.gps.isEnabled(hook);
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
            $scope.gps.getAcquisition(placerPoint);
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

        // Recentrer sur dernière pos connue
        Global.map.panTo($scope.location);


    }

    // Affiche la carte
    $scope.initializeMap = function() {

        // Si gps ok et carte non initialisée
        if ($scope.gps_actif && Global.map === null) {
            // Initialiser la variable utilisée pour stocker la position
            $scope.location = null;
            // Besoin du hook pour initialiser la map sur pos initiale
            $scope.gps.getAcquisition(finalizeMap)
        }
        alert(Global.map);
        // redessiner la carte (ne rédéssine pas pour une raison obscure)
        google.maps.event.trigger(Global.map, 'resize');

    }

    function finalizeMap(item) {
        var mapOptions = {
            center: new google.maps.LatLng(item.latitude, item.longitude),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        Global.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }


    // Test si le Gps est allumé
    verifierGPS($scope.initializeMap);


}