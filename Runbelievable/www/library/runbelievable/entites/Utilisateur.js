/**
 * Classe gérant les utilisateurs
 * @param json Paramètres de l'utilisateur
 */
function Utilisateur(json) {
    
    // Informations de l'utilisateur
    this.idUser = -1;
    
    // Nom de l'utilisateur
    this.nom = "";
    
    // Prénom de l'utilisateur
    this.prenom = "";
    
    // Âge de l'utilisateur
    this.age = 0;
    
    // Photo de l'utilisateur
    this.photo = "";
    
    // Email de l'utilisateur
    this.email = "";
    
    // Password de l'utilisateur
    this.password = "";
    
    // Liste d'acquisition de l'utilisateur
    this.listeAcquisition = null;
    
    // Catégorie de l'utilisateur
    this.categorie = "Amateur";
    
    // Test si un json est défini
    if(json) {
        this.nom = json.nom;
    }
    
}
