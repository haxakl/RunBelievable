/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope, Global) {

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
     * Méthode permettant de localiser l'utilisateur
     * @param {type} item Nouvelles données
     */
    function placerPoint(item) {

        if (!$scope.gestionnaires.gps.actif || item === null) {
            return;
        }

        // maj la location
        Global.location = new google.maps.LatLng(item.latitude, item.longitude);


        if (Global.lastLocation !== null) {
            var tabSegment = [
                Global.lastLocation,
                Global.location
            ];

            var segment = new google.maps.Polyline({
                path: tabSegment,
                geodesic: true,
                strokeColor: '#156AEB',
                strokeOpacity: 0.95,
                strokeWeight: 2
            });

            segment.setMap(Global.map);
        }

        Global.map.setCenter(Global.location);
        Global.lastLocation = Global.location;

        // push dans liste acquisitions
        $scope.session.listeAcquisitions.push(item);

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        $scope.refresh();

    }

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
            $scope.gestionnaires.gps.getAcquisition(placerPoint);

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
        Global.map.panTo(Global.location);


    }

    // TODO maj pour maps angular
    function finalizeMap(item, hook) {
        var mapOptions = {
          center: new google.maps.LatLng(item.latitude, item.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // maj la carte
        Global.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        Global.location = item;
       
       // Map chargé
       google.maps.event.addListenerOnce(Global.map, 'idle', function(){
           $scope.resetMap();
       })

        // appeler hook si il y en a un
        if (typeof hook !== "undefined")
            hook();
        else {
            // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
            $scope.refresh();
        }

    }

    // Reset de la map TODO
    $scope.resetMap = function() {

        var markers = $scope.session.listeAcquisitions;

        // On parcourt les acquisitions effectuées
        for (var i = 0; i < markers.length; i++) {

            // maj la position
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(markers[i].latitude, markers[i].longitude),
                map: Global.map,
                title: 'FOUND YO SORRY ASS !!'
            });

        }

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    };

    // Affiche la carte
    $scope.initializeMap = function() {

        // Si gps ok
        if (!$scope.gestionnaires.gps.actif) {
            return false;
        }

        $scope.gestionnaires.gps.getAcquisition(finalizeMap); // Besoin du hook pour initialiser la map sur pos initiale

    };

    // Test si le Gps est allumé    
    $scope.gestionnaires.gps.isEnabled($scope.initializeMap);

}