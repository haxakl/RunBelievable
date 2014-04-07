/**
 * L'objet session contenant les informations de l'application en fonctionnement ainsi que les variables partagées entre les controleurs. 
 */
function InfoApplication() {

    // La session dont on affiche les statistiques
    this.sessionAfficheeStatistiques = [];

    // Tableau servant pour la map
    this.Global = {
        map: null,
        location: null,
        lastLocation: null,
        mapError: false
    };

}
