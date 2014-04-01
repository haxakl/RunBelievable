
/**
 * Classe gérant les utilisateurs
 */
function Utilisateur() {
    
    // Informations de l'utilisateur
    this.idUser = -1;
    
    this.nom = "";
    this.prenom = "";
    this.age = 0;
    this.photo = "";
    
    this.listeAcquisition = null;
    
    // Récupérer un utilisateur
    this.recup = function(login, password) {
        
        // TODO Réquête ajax vers une adresse distante
        // Problème de cross domain évident comment faire ?
        
    };
    
}
