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
                longitude: position.coords.longitude
            };

            // Si le hook est null on retourne le resultat
            if (hook === null)
                return acquisition;

            hook(acquisition);


        }, function() {

        }, {
            maximumAge: 1000,
            timeout: 1000,
            enableHighAccuracy: true
        });

    };

}
