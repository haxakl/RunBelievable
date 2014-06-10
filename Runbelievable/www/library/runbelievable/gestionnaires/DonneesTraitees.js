
/**
 * Cette classe contient le gestionnaire du Gps et de l'Accéléromètre
 * Il vous permet de traiter les données en implémentant divers fonctions.
 * @param $scope Scope de l'application
 */
function DonneesTraitees($scope) {
    
    // Gestionnaires
    this.gps = $scope.gestionnaires.gps;
    this.accelerometre = $scope.gestionnaires.accelerometre;
    this.utilisateurs = $scope.gestionnaires.utilisateurs;
    
    /**
     * Calcule des calories perdu
     * 
     * @return int Nombre de calories perdu
     */
    function nbCaloriesPerdues(){
        
        // Récupération du poids de l'utilisateur
        var poidKg = this.utilisateurs.poids;
        
        // Récupération de la distance parcourue
        var distanceKm = this.gps;
        
        // On retourne le nombre de calories
        return poidKg * distanceKm ; 
    }
    
}
