
// Classe Javascript pour la gestion du Gps
function Gps() {

    this.gps_actif = false;
    this.timeout_gps = null;

    /**
     * Test si le gps est activé.
     * @returns {undefined}
     */
    this.isEnabled = function() {
        afficherAlerte("Information", "Test de votre Gps en cours ...", "info");

        // Test si le Gps existe sur le téléphone
        !navigator.geolocation ? afficherAlerte("Erreur", "Le Gps n'est pas fonctionnel sur ce téléphone", "danger") : "";

        var gps = this;

        // Essaie de récupérer la position
        navigator.geolocation.getCurrentPosition(function() {
            afficherAlerte("Succès", "Votre Gps est bien activé", "succes");
            $("#debut_geo").show();

            $("#debut_geo").click(function() {
                gps.lancerAcquisition();
            });
            gps.gps_actif = true;
            setTimeout(function() {
                cacherAlerte();
            }, 3000);
        }, function() {
            afficherAlerte("Erreur", "Le Gps n'est pas fonctionnel sur ce téléphone", "danger");
        }, {maximumAge: 3000, timeout: 20000, enableHighAccuracy: true});
    };

    /**
     * Démarre l'acquisition
     * @returns {undefined}
     */
    this.lancerAcquisition = function() {

        // Test si le Gps est actif
        if (!this.gps_actif) {
            return false;
        }

        var gps = this;

        // Change le bouton
        $("#debut_geo").text("Arrêter l'acquisition");
        $("#debug_geo").unbind();
        $("#debut_geo").click(function() {
            gps.stopAcquisition();
        });

        // Essaie de récupérer les données
        this.timeout_gps = navigator.geolocation.watchPosition(function(position) {
            $("#geolocalisation").append("<tr><td>" + position.coords.latitude + "</td><td>" + position.coords.longitude + "</td></tr>");
            $(".alert").hide();
        }, function() {

        }, {maximumAge: 1000, timeout: 1000, enableHighAccuracy: true});

    };

    /**
     * Arrête l'acquisition
     * @returns {undefined}
     */
    this.stopAcquisition = function() {

        // Test si le Gps est actif
        if (!this.gps_actif) {
            return false;
        }

        // Test s'il y a une acquisition en cours
        navigator.geolocation.clearWatch(this.timeout_gps);

        $("#debut_geo").text("Acquisition");

    };

    // Test si le Gps est allumé
    this.isEnabled();
}
