/**
 *   Classe Javascript pour la gestion du Gps
 */
function Gps($scope) {

    // Acquisitions en cours
    this.gps_acquisition_actif = false;

    // L'interval de temps entre 2 acquisitions
    this.interval_acquisition = 1000;

    // Variable avec l'activation du gps
    this.actif = false;

    /**
     * Modifie l'icône du Gps.
     * @param {type} type Type icône
     */
    this.modifIcone = function(type, texte) {
        $scope.icones_gps.html('<i class="fa fa-map-marker"></i><label class="label label-' + type + '">' + texte + '</label>');
    };

    /**
     * Test si le gps est activé et appel le hook passé en paramètre.
     * @param {type} hook Hook de la fonction
     */
    this.isEnabled = function(hook) {

        // Test si le Gps existe sur le téléphone
        if (!navigator.geolocation) {
            $scope.gestionnaires.gps.actif = false;
            return false;
        }

        navigator.geolocation.getCurrentPosition(function() {
            $scope.gestionnaires.gps.modifIcone("success", "Gps activé");
            $scope.gestionnaires.gps.actif = true;
            if ($scope.mapError) {
                $scope.gestionnaires.map.initializeMap();
            }
            $scope.mapError = false;
            if(hook !== null)
                hook();
        }, function() {
            $scope.gestionnaires.gps.modifIcone("danger", "Gps désactivé");
            $scope.gestionnaires.gps.actif = false;
            $scope.mapError = true;
        }, {
            maximumAge: 3000,
            timeout: 20000,
            enableHighAccuracy: true
        });

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        $scope.refresh();
    };

    /**
     * Récuperer l'acquisition actuelle et appel le hook passé en paramètre.
     * @param {type} hook Hook de la fonction
     */
    this.getAcquisition = function(hook) {

        var acquisition = null;

        navigator.geolocation.getCurrentPosition(function(position) {
            // On créer l'objet contenant les informations de l'acquisition de données
            acquisition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude,
                timestamp: position.timestamp
            };

            // Si le hook est null on retourne le resultat
            if (typeof hook === "undefined")
                return acquisition;

            hook(acquisition);

        }, function() {

        }, {
            maximumAge: 1000,
            timeout: 1000,
            enableHighAccuracy: true
        });

    };

    /**
     * Métode permettant de calculer la distance en km entre 2 points à
     * partir de leurs coordonnées GPS. 
     */
    this.getDistance2Points = function(lat1, lon1, lat2, lon2) {

        //Conversion des latitudes/longitudes en degrés vers du radian
        lat1Rad = toRad(lat1);
        lon1Rad = toRad(lon1);
        lat2Rad = toRad(lat2);
        lon2Rad = toRad(lon2);

        // On calcul la distance en radian entre les 2 points GPS
        distanceRad = 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((lat1Rad - lat2Rad) / 2)), 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * (Math.pow(Math.sin(((lon1Rad - lon2Rad) / 2)), 2))));

        // On calcule cette distance en km grace au rayon de la terre
        return distanceRad * 6366;
    };

    /**
     * Méthode convertissant un nombre en degrès vers un nombre en radians
     * @param {Object} nombre
     */
    function toRad(nombre) {
        return nombre * Math.PI / 180;
    }
    ;

}
