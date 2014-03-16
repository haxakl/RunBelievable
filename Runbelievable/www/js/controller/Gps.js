/**
 *   Classe Javascript pour la gestion du Gps
 */
function Gps($scope) {

    // Acquisitions en cours
    this.gps_acquisition_actif = false;

    // L'interval de temps entre 2 acquisitions
    this.interval_acquisition = 1000;

    /**
     * Modifie l'icône du Gps.
     * @param {type} type Type icône
     */
    this.modifIcone = function(type) {
        $scope.icones_gps.removeClass("text-danger text-info text-success");
        $scope.icones_gps.addClass("text-" + type);
    };

    /**
     * Test si le gps est activé et appel le hook passé en paramètre.
     * @param {type} hook Hook de la fonction
     */
    this.isEnabled = function(hook) {

        // Test si le Gps existe sur le téléphone
        if (!navigator.geolocation)
            return false;

        navigator.geolocation.getCurrentPosition(function() {
            $scope.gps.modifIcone("success");
            $scope.gps_actif = true;
            hook();
        }, function() {
            $scope.gps.modifIcone("danger");
            $scope.gps_actif = false;
            $scope.afficherAlerte("Erreur", "Le Gps n'est pas fonctionnel sur ce téléphone", "danger");
            // On fait disparaitre l'alerte après 3 secondes
            setTimeout(function() {
                $scope.cacherAlerte();
            }, 3000);
        }, {
            maximumAge: 3000,
            timeout: 20000,
            enableHighAccuracy: true
        });

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }
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
                altitude : position.coords.altitude,
                timestamp : position.timestamp
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
    };

}
