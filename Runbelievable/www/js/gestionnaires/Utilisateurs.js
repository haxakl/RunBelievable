
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
            $("#connexion_profil .alert").fadeIn(500);
            if(msg.indexOf("Erreur: ") !== -1) {
                $("#connexion_profil .alert").html("<i class='fa fa-times'></i> " + msg.replace("Erreur: ", ""));
            } else {
                $("#connexion_profil .alert").removeClass(".alert-danger");
                $("#connexion_profil .alert").addClass(".alert-success");
                $("#connexion_profil .alert").html("<i class='fa fa-check'></i> " + msg);
            }
        });
        
    };
    
}
