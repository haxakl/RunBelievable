/**
* Controler d'une session.
*
*/
function SessionController($scope) {

    var gps = new Gps(this);

    var interval_acquisition = 1000;
    var boucleID;


    /**
    *   Permet de verifier si le GPS fonctionne correctement sur le mobile.
    *
    */
    this.verifierGPS = function(){
        var controller = this;

        afficherAlerte("Information", "Test de votre Gps en cours ...", "info");

        var isEnabled = gps.isEnabled(controller.autoriserAcquisition);
    }

    /**
    * Permet de mettre à jour l'application si le GPS est autorisé ou non
    *
    */
    this.autoriserAcquisition = function(isAutorise) {

        if (isAutorise) {
            // On met à jour l'IHM
            afficherAlerte("Succès", "Votre Gps est bien activé", "succes");

            // Ajout des fonctionnalités au bouton
            $("#debut_geo").show();
            $("#debut_geo").unbind();
            $("#debut_geo").click(function() {
                lancerAcquisition();
            });

            // On active le gps
            gps.gps_actif = true;

            // On fait disparaitre l'alerte après 3 secondes
            setTimeout(function() {
                cacherAlerte();
            }, 3000);
        }
        else {
            afficherAlerte("Erreur", "Le Gps n'est pas fonctionnel sur ce téléphone", "danger");
        }
    }

    /**
     * Démarre l'acquisition
     * @returns {undefined}
     */
    function lancerAcquisition() {

        var controller = this;

        // Test si le Gps n'est pas actif on ne fait rien
        if (!gps.gps_actif) {
            return false;
        }


        // Change le bouton de lancement d'acquisition
        $("#debut_geo").text("Arrêter l'acquisition espagnole");
        $("#debut_geo").unbind();
        $("#debut_geo").click(function() {
            stopAcquisition();
        });

         // Boucle de récuperation des données
        controller.boucleID = setInterval(function() {

            gps.getAcquisition(ajouterAcquisitionGPS);

            $(".alert").hide();
        }, interval_acquisition);
    }

    /**
     * Arrête l'acquisition
     * @returns {undefined}
     */
    function stopAcquisition() {

        var controller = this;

        // Test si le Gps n'est pas actif on ne fait rien
        if (!gps.gps_actif) {
            return false;
        }

        // On arrete l'acquisition
        clearInterval(controller.boucleID);
        
        // On change le texte
        $("#debut_geo").text("Relancer l'acquisition");
        $("#debut_geo").unbind();
            $("#debut_geo").click(function() {
                lancerAcquisition();
        });
    };

        /**
    * Méthode permettant d'ajouter une acquisition de position GPS.
    */
    ajouterAcquisitionGPS = function(item) {
        if (item == null)
            return;

        $scope.listeAcquisitions.push(item);

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    // Test si le Gps est allumé
    this.verifierGPS();
}