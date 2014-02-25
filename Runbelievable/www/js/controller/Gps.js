
// Classe Javascript pour la gestion du Gps
function Gps($controler) {

    this.gps_actif = false;
    this.timeout_gps = null;

    // L'interval de temps entre 2 acquisitions
    this.interval_acquisition = 1000;
    var boucleID;

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
        $("#debut_geo").text("Arrêter l'acquisition espagnole");

        $("#debut_geo").unbind();

        $("#debut_geo").click(function() {
            gps.stopAcquisition();
        });

        // Essaie de récupérer les données
        /*this.timeout_gps = navigator.geolocation.watchPosition(function(position) {
            $("#geolocalisation").append("<tr><td>" + position.coords.latitude + "</td><td>" + position.coords.longitude + "</td></tr>");
            $(".alert").hide();
        }, function() {

        }, {maximumAge: 1000, timeout: 1000, enableHighAccuracy: true});*/

        // Boucle de récuperation des données
        boucleID = setInterval(function() {
             navigator.geolocation.getCurrentPosition(function(position) {
                // On créer l'objet contenant les informations de l'acquisition de données
                $acquisition = {
                        latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                // On ajoute l'acquisition à la liste
                $controler.ajouterAcquisitionGPS($acquisition);
                $(".alert").hide();
            }, function() {

            }, {maximumAge: 1000, timeout: 1000, enableHighAccuracy: true});

        }, this.interval_acquisition);

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

        // On arrete l'acquisition
        clearInterval(boucleID);
        
        // On change le texte
        $("#debut_geo").text("Acquisition");

    };

    // Test si le Gps est allumé
    this.isEnabled();
}
