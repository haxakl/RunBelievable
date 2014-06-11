
/**
 * Cette classe contient le gestionnaire du Gps,de l'Accéléromètre  et l'utilisateur.
 * Il vous permet de traiter les données en implémentant divers fonctions.
 * @param $scope Scope de l'application
 */
function DonneesTraitees($scope) {

    // Gestionnaires
    this.scope = $scope;
    this.gps = $scope.gestionnaires.gps;
    this.accelerometre = $scope.gestionnaires.accelerometre;
    this.utilisateurs = $scope.gestionnaires.utilisateurs;
    this.countPause = 0;

    /**
     * Calcule des calories perdu
     * 
     * @return int Nombre de calories perdu
     */
    this.nbCaloriesPerdues = function() {

        // Récupération du poids de l'utilisateur
        var poidKg = this.utilisateurs.poids;

        // Récupération de la distance parcourue
        var distanceKm = this.gps;

        // On retourne le nombre de calories
        return poidKg * distanceKm;

    };

    /**
     * Détecter une pause dans la course
     * @return boolean Pause de la course
     */
    this.detecterPause = function() {

        // On récupère les données        
        var lastdonnees = this.scope.gestionnaires.gps.lastPosition.coords;
        var previousdonnees = this.scope.session.getLastDonnees();

        // On test si le gps n'est pas bougé
        if (lastdonnees !== null && previousdonnees !== null && lastdonnees.latitude === previousdonnees.latitude && lastdonnees.longitude === previousdonnees.longitude) {
            this.countPause++;
        } else {
            this.countPause = 0;
        }

        // On regarde si on est en pause
        if (this.countPause > 2) {
            console.log("En pause");
            return true;
        }

        // On est pas en pause
        return false;
    };

    /**
     * Calcule le vitesse actuelle
     */
    this.vitesseActuelle = function() {

        // Il nous faut au minimum 2 acquisition
        if (this.scope.session.listeAcquisitions.length > 1) {
            var acquisitonActuelle = $scope.session.getLastDonnees();
            var acquisitonPrecedente = $scope.session.getBeforeLastDonnees();

            var distance = $scope.gestionnaires.gps.getDistance2Points(acquisitonActuelle.latitude, acquisitonActuelle.longitude, acquisitonPrecedente.latitude, acquisitonPrecedente.longitude);
            var tempsEntre2Points = (acquisitonActuelle.timestamp - acquisitonPrecedente.timestamp) / 1000;

            if (isNaN($scope.vitesseActuelle)) {
                return 0;
            }

            return 3600 * distance / tempsEntre2Points;
        }
        
    };

    /**
     * Récupère un objet JSON avec toutes les données voulues
     */
    this.getDonnees = function() {
        var tmp = new Object();
//        tmp.vitesse = this.vitesseActuelle();
//        tmp.calorie = this.nbCaloriesPerdues();
        return tmp;
    };

    /**
     * Boucle de calcule des différentes données
     */
    this.boucle = function() {
        return this.getDonnees();
    };

}
