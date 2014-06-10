/**
 * L'objet session contenant les informations d'une session et les differentes formules de lissage et calculs de statistiques. 
 */
function Session() {

    // Liste des acquisitions GPS
    this.listeAcquisitions = [];

    this.reference = Math.random().toString(36).substring(3);

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

    this.nombreDePause = 0;

    this.nom = "";

    this.calorie = 0;

    // La date de la course
    this.date = new Date();

    // Le tableau des pauses, contient des objets Pause
    this.pauses = [];

    this.save = false;

    /**
     * Récuperer les dernières données
     * @returns {Array} Dernière données de l'acquisition
     */
    this.getLastDonnees = function() {
        if (this.listeAcquisitions[this.listeAcquisitions.length - 1]) {
            return this.listeAcquisitions[this.listeAcquisitions.length - 1];
        } else {
            return null;
        }
    };

    /**
     * Récuperer les dernières données
     * @returns {Array} Dernière données de l'acquisition
     */
    this.getBeforeLastDonnees = function() {
        if (this.listeAcquisitions[this.listeAcquisitions.length - 2]) {
            return this.listeAcquisitions[this.listeAcquisitions.length - 2];
        } else {
            return null;
        }
    };

}
