/**
 *   Classe Javascript pour la gestion du Gps
 */
function Gps($scope) {

    // Acquisitions en cours
    this.gps_acquisition_actif = false;

    // L'interval de temps entre 2 acquisitions
    this.interval_acquisition = 1000;

    this.positions = new Array();

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

        // Si le hook est null on retourne le resultat
        if (typeof hook === "undefined" || hook === null)
            return this.gps_acquisition_actif;

        hook(this.gps_acquisition_actif);

    };

    /**
     * Récuperer l'acquisition actuelle et appel le hook passé en paramètre.
     * @param {type} hook Hook de la fonction
     */
    this.getAcquisition = function(hook) {

        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.infoApplication.Global.alertTriggered.gps = false;

            $scope.gestionnaires.gps.modifIcone("success", "Gps activé");
            $scope.gestionnaires.gps.actif = true;

            $scope.gestionnaires.gps.positions.push(position);
            $scope.gestionnaires.gps.lastPosition = position;
            
            var acquisition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude,
                accuracy: position.coords.accuracy,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                timestamp: position.timestamp,
                code: position.code,
                message: position.message
            };
            
            if(typeof hook !== "undefined") {
                hook(acquisition);
            }
        }, function(error) {
            $scope.gestionnaires.gps.modifIcone("danger", "Gps désactivé");
            $scope.gestionnaires.gps.actif = false;
            $scope.mapError = true;
            $scope.gestionnaires.gps.lastPosition = error;
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

}
