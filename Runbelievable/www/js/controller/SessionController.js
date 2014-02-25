/**
* Controler d'une session.
*
*/
function SessionController($scope) {

    var gps = new Gps(this);

    this.interval_acquisition = 1000;
    var boucleID;

	/**
	* Méthode permettant d'ajouter une acquisition de position GPS
	*/
    this.ajouterAcquisitionGPS = function(item) {
    	$scope.listeAcquisitions.push(item);

    	// Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
    	if(!$scope.$$phase) {
			$scope.$apply();
		}
    }

    this.verifierGPS = function(){
        var controller = this;

        afficherAlerte("Information", "Test de votre Gps en cours ...", "info");

        var isEnabled = gps.isEnabled(controller.autoriserAcquisition);
    }

    this.autoriserAcquisition = function(isAutorise) {
        $controler = this;

        if (isAutorise) {
            // On met à jour l'IHM
            afficherAlerte("Succès", "Votre Gps est bien activé", "succes");

            // Ajout des fonctionnalités au bouton
            $("#debut_geo").show();
            $("#debut_geo").unbind();
            $("#debut_geo").click(function() {
                console.log($controler);
                $controler.lancerAcquisition();
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
    this.lancerAcquisition = function() {

        var controller = this;

        // Test si le Gps n'est pas actif on ne fait rien
        if (!gps.gps_actif) {
            return false;
        }


        // Change le bouton de lancement d'acquisition
        $("#debut_geo").text("Arrêter l'acquisition espagnole");
        $("#debut_geo").unbind();
        $("#debut_geo").click(function() {
            gps.stopAcquisition();
        });

         // Boucle de récuperation des données
        boucleID = setInterval(function() {

            var acquisition = gps.getAcquisition();

            if (acquisition != null)
                controller.ajouterAcquisitionGPS($acquisition);

            $(".alert").hide();
        }, this.interval_acquisition);
    }

    /**
     * Arrête l'acquisition
     * @returns {undefined}
     */
    this.stopAcquisition = function() {

        // Test si le Gps n'est pas actif on ne fait rien
        if (!gps.gps_actif) {
            return false;
        }

        // On arrete l'acquisition
        clearInterval(boucleID);
        
        // On change le texte
        $("#debut_geo").text("Acquisition");

        gps.gps_actif = false;
    };

    // Test si le Gps est allumé
    this.verifierGPS();
}