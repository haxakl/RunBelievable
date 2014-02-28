/**
 *   Classe Javascript pour la gestion du Gps
 */
function Gps() {

    // Gps actif ou non
    this.gps_actif = false;

    // L'interval de temps entre 2 acquisitions
    this.interval_acquisition = 1000;

    /**
     * Modifie l'icône du Gps.
     * @param {type} type Type icône
     */
    this.modifIcone = function(type) {
        icones_gps.removeClass("text-danger text-info text-success");
        icones_gps.addClass("text-" + type);
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
            gps.modifIcone("success");
            gps.gps_actif = true;
            hook();
        }, function() {
            gps.modifIcone("danger");
            gps.gps_actif = false;
            hook();
        }, {maximumAge: 3000, timeout: 20000, enableHighAccuracy: true});
    };

    /**
     * Récuperer l'acquisition actuelle et appel le hook passé en paramètre.
     * @param {type} hook Hook de la fonction
     */
    this.getAcquisition = function(hook) {

        // Si le Gps est actif
        if (this.gps_actif) {
            var acquisition = null;

            navigator.geolocation.getCurrentPosition(function(position) {
                // On créer l'objet contenant les informations de l'acquisition de données
                acquisition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                hook(acquisition);

            }, function() {

            }, {maximumAge: 1000, timeout: 1000, enableHighAccuracy: true});
        }
    };

}
