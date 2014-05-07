/**
 * L'objet session contenant les informations de l'application en fonctionnement ainsi que les variables partagées entre les controleurs. 
 */
function InfoApplication() {

    // La session dont on affiche les statistiques
    this.sessionAfficheeStatistiques = [];

    // Tableau servant pour la map
    // map : contient la google map
    // dernière position connue
    // lastLocation : avant dernière position connue (pour le déssin des segments)
    // mapError : permet de savoir s'il faut reconstruire la map (écite l'effet de scintillement de la carte avec un raffraichissement systématique)
    // permet d'enclencher l'état de pause si le compteur atteint pauseTrigger (nombre de fois que l'on détecte une vitesse très faible ou 
    // une distance très faible entre 2 acquisitions)
    // vitesseLimite : en dessous de cette valeur (vitesse en km/h) le counter de pause est incrémenté
    // distanceLimite : distance en km en dessous de laquelle le counter de pause est incrémenté
    this.Global = {
        map: null,
        location: null,
        lastLocation: null,
        mapError: false,
        pauseCounter: 0,
        pauseTrigger: 5,
        vitesseLimite : 3,
        distanceLimite : 0.001,
    };

}
