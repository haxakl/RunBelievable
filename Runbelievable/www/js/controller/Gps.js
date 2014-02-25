/**
*   Classe Javascript pour la gestion du Gps
*
*/ 
function Gps($controler) {

    this.gps_actif = false;

    // L'interval de temps entre 2 acquisitions
    this.interval_acquisition = 1000;
    var boucleID;

    /**
     * Test si le gps est activé.
     * @returns {undefined}
     */
    this.isEnabled = function(hook) {

        // Test si le Gps existe sur le téléphone
        if (!navigator.geolocation)
            return false;

        navigator.geolocation.getCurrentPosition(function() {
            hook(true);
        }, function() {
            hook(false);
        }, {maximumAge: 3000, timeout: 20000, enableHighAccuracy: true});
    };

    /**
     * Recuperer l'acquisition actuelle
     * @returns {undefined}
     */
    this.getAcquisition = function() {
        var acquisition = null;

   
        navigator.geolocation.getCurrentPosition(function(position) {
            // On créer l'objet contenant les informations de l'acquisition de données
            acquisition = {
                    latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

        }, function() {

        }, {maximumAge: 1000, timeout: 1000, enableHighAccuracy: true});

        return acquisition;
    };
    
}
