
/**
 * Cette classe contient le gestionnaire du Gps et de l'Accéléromètre
 * Il vous permet de traiter les données en implémentant divers fonctions.
 */
function DonneesTraitees($scope) {
    
    // Gestionnaires
    this.gps = $scope.gestionnaires.gps;
    this.accelerometre = $scope.gestionnaires.accelerometre;
    this.utilisateurs = $scope.gestionnaires.utilisateurs;
    
    /*****************************************
     *       Calcule des calories            * 
     *****************************************/
    function calculCaloriesPerdu(){
        poidKg = this.utilisateurs;
        distanceKm = this.gps;
        
        kcalDepensees = poidKg * distanceKm ; 
        
    }
    
    
    
}
