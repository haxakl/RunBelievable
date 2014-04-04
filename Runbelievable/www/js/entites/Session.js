/**
 * L'objet session contenant les informations d'une session et les differentes formules de lissage et calculs de statistiques. 
 */
function Session() {

    // Liste des acquisitions GPS
    this.listeAcquisitions = [];

    // Vitesses en km/h
    this.vitesseMax = 0.0;
    this.vitesseMin = 1000.0;
    this.vitesseMoyenne = 0.0;

    // Durée de la session en secondes
    this.dureeSession = 0;
    this.dureeSessionString = 0;  // La durée au format "00h 00m 00s"

    this.denivele = 0.0;

    // En km
    this.distanceParcouru = 0.0;

    this.caloriesDepensees = 0;

    this.nombreDePause = 0;
    
    this.nom = "";
   
    this.calorie =0;
};
