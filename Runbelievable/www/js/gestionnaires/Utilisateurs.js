
/**
 * Classe gérant les utilisateurs
 */
function Utilisateurs() {
    
    // Récupérer un utilisateur
    this.connexion = function(login, password) {
        
        $("#connexion_profil .alert").hide();
        
        $.post("http://runbelievable.netai.net/modules/utilisateurs/ajax.php", {
            fonction: "connexion",
            login: login,
            password: password
        }).done(function(msg) {
            if(msg.indexOf("Erreur: ") !== -1) {
                $("#connexion_profil .alert").fadeIn(500);
                $("#connexion_profil .alert").text(msg);
            }
        });
        
    };
    
}
