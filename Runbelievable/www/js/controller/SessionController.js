/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope) {

    var bouton_acquisition = $("#debut_geo");
    var interval_acquisition = 1000;
    var boucleID = null;

    /**
     *   Permet de verifier si le GPS fonctionne correctement sur le mobile.
     */
    function verifierGPS() {
        gps.modifIcone("info");
        gps.isEnabled(autoriserAcquisition);
    }

    /**
     * Permet de mettre à jour l'application si le GPS est autorisé ou non
     */
    function autoriserAcquisition() {

        // Si le gps a été autorisé
        if (gps.gps_actif) {

            // Ajout des fonctionnalités au bouton
            cleanButton(null, lancerAcquisition);

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
     * Enlève tous les évènements du bouton d'acquisition.
     * @param {type} nouveau_texte Nouveau texte {option}
     * @param {type} nouveau_evt Nouvel élément {option}
     */
    function cleanButton(nouveau_texte, nouveau_evt) {
        bouton_acquisition.show();
        bouton_acquisition.unbind();
        if (nouveau_texte && nouveau_texte !== null) {
            bouton_acquisition.text(nouveau_texte);
        }
        if (nouveau_evt && nouveau_evt !== null) {
            bouton_acquisition.click(function() {
                nouveau_evt();
            });
        }
    }

    /**
     * Méthode permettant d'ajouter une acquisition de position GPS.
     * @param {type} item Nouvelles données
     */
    function ajouterAcquisitionGPS(item) {
        if (item === null)
            return;

        $scope.listeAcquisitions.push(item);
        
        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    /**
     * Démarre l'acquisition
     */
    function lancerAcquisition() {
        var controller = this;

        // Test si le Gps n'est pas actif on ne fait rien
        if (!gps.gps_actif) {
            return false;
        }
        
        // Change le bouton de lancement d'acquisition
        cleanButton("Arrêter l'acquisition", stopAcquisition);

        // Boucle de récuperation des données
        boucleID = setInterval(function() {
            gps.getAcquisition(ajouterAcquisitionGPS);
            $(".alert").hide();
        }, interval_acquisition);
    };

    /**
     * Arrête l'acquisition
     */
    function stopAcquisition() {
        // Test si le Gps n'est pas actif on ne fait rien
        if (!gps.gps_actif) {
            return false;
        }

        // On arrete l'acquisition
        clearInterval(boucleID);

        // On change le texte
        this.cleanButton("Relancer l'acquisition", lancerAcquisition);
    };

    // Test si le Gps est allumé
    verifierGPS();
}