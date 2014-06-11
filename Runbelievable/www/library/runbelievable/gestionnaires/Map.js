/**
 *   Classe Javascript pour la gestion de la Map
 */
function Map($scope) {


    // Affiche la carte
    this.initializeMap = function() {

        // Si gps ok
        if (!$scope.gestionnaires.gps.actif) {
            return false;
        }

        $scope.gestionnaires.gps.getAcquisition($scope.gestionnaires.map.finalizeMap); // Besoin du hook pour initialiser la map sur pos initiale

    };

    this.finalizeMap = function(item, hook) {
        var mapOptions = {
            center: new google.maps.LatLng(item.latitude, item.longitude),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        if ($("#map").length !== 0) {
            // maj la carte
            $scope.infoApplication.Global.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $scope.infoApplication.Global.location = new google.maps.LatLng(item.latitude, item.longitude);

            // Map chargé
            google.maps.event.addListenerOnce($scope.infoApplication.Global.map, 'idle', function() {
                $scope.gestionnaires.map.resetMap();
            });

            // appeler hook si il y en a un
            if (typeof hook !== "undefined")
                hook();
            else {
                // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
                $scope.refresh();
            }
        }

    }

    // Reset de la map
    this.resetMap = function() {

        var points = $scope.session.listeAcquisitions;
        var buf = null;

        // On parcourt les acquisitions effectuées
        for (var i = 0; i < points.length; i++) {
            if (buf !== null) {
                var tabSegment = [
                    new google.maps.LatLng(buf.latitude, buf.longitude),
                    new google.maps.LatLng(points[i].latitude, points[i].longitude)
                ];

                var segment = new google.maps.Polyline({
                    path: tabSegment,
                    geodesic: true,
                    strokeColor: '#156AEB',
                    strokeOpacity: 0.95,
                    strokeWeight: 2
                });

                segment.setMap($scope.infoApplication.Global.map);
            }
            buf = points[i];

        }

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    }

    /**
     * Méthode permettant de localiser l'utilisateur
     * @param {type} item Nouvelles données
     */
    this.placerPoint = function(item) {

        if (!$scope.gestionnaires.gps.actif || item === null) {
            return;
        }

        // maj la location
        $scope.infoApplication.Global.location = new google.maps.LatLng(item.latitude, item.longitude);


        if ($scope.infoApplication.Global.lastLocation !== null) {
            var tabSegment = [
                $scope.infoApplication.Global.lastLocation,
                $scope.infoApplication.Global.location
            ];

            var segment = new google.maps.Polyline({
                path: tabSegment,
                geodesic: true,
                strokeColor: '#156AEB',
                strokeOpacity: 0.95,
                strokeWeight: 2
            });

            segment.setMap($scope.infoApplication.Global.map);
        }

        $scope.infoApplication.Global.map.setCenter($scope.infoApplication.Global.location);
        $scope.infoApplication.Global.lastLocation = $scope.infoApplication.Global.location;

        // push dans liste acquisitions
        $scope.session.listeAcquisitions.push(item);

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        $scope.refresh();

    }

    //Permet de recentrer la carte sur un point
    // item = google.maps.LatLng
    this.centrer = function(item) {
        $scope.infoApplication.Global.map.panTo(item);

    }
}