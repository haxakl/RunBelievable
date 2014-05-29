/**
 *   Classe Javascript pour la gestion du Gps
 */
function Accelerometre($scope) {

    // Mesures
    this.mesures = new Array();

    // Variable avec l'activation du gps
    this.actif = false;

    /**
     * Modifie l'icône du Gps.
     * @param {type} type Type icône
     */
    this.modifIcone = function(type, texte) {
        $scope.icone_accelerometre.html('<i class="fa fa-mobile"></i><label class="label label-' + type + '">' + texte + '</label>');
    };

    /**
     * Récuperer l'acquisition actuelle et appel le hook passé en paramètre.
     * @param {type} hook Hook de la fonction
     */
    this.getAcquisition = function(hook) {

        if (typeof navigator.accelerometer === "undefined") {
            $scope.gestionnaires.accelerometre.modifIcone("danger", "Accéléromètre désactivé");
            $scope.gestionnaires.accelerometre.actif = false;

        }
        else {
            navigator.accelerometer.getCurrentAcceleration(function(position) {
                $scope.infoApplication.Global.alertTriggered.accelerometre = false;

                $scope.gestionnaires.accelerometre.modifIcone("success", "Accéléromètre activé");
                $scope.gestionnaires.accelerometre.actif = true;

                $scope.gestionnaires.accelerometre.mesures.push(position);
                $scope.gestionnaires.accelerometre.lastMesure = position;

                // Si le hook est null on retourne le resultat
                if (typeof hook !== "undefined" && hook !== null)
                    hook(acquisition);

            }, function(error) {
                $scope.gestionnaires.accelerometre.modifIcone("danger", "Accéléromètre désactivé");
                $scope.gestionnaires.accelerometre.actif = false;
                $scope.gestionnaires.accelerometre.lastMesure = error;

            });
        }

    };


}
