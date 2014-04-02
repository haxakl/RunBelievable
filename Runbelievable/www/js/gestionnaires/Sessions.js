
// Gère les sessions
function Sessions() {

    // Sauvegarder la session
    this.sauvegarderSession = function(nomSession, session, user) {
        
        // Nom de la session est vide
        if (nomSession !== "") {
            
            // Requête post
            $.post("http://runbelievable.netai.net/modules/sessions/ajax.php", {
                fonction: "connexion",
                utilisateur: JSON.stringify(user),
                nom: nomSession,
                session: JSON.stringify(session)
            }).done(function(msg) {
//                $("#connexion_profil .alert").fadeIn(500);
//                if (msg.indexOf("Erreur: ") !== -1) {
//                    $("#connexion_profil .alert").html("<i class='fa fa-times'></i> " + msg.replace("Erreur: ", ""));
//                } else {
//                    $("#connexion_profil .alert").removeClass("alert-danger");
//                    $("#connexion_profil .alert").addClass("alert-success");
//                    $("#connexion_profil .alert").html("<i class='fa fa-check'></i> Connexion réussi");
//                    this.user = new Utilisateur(msg);
//                    $("#menuG .logo .nom").text(this.user.nom);
//                    $("#menuG .logo .categorie").text(this.user.categorie);
//                    setTimeout(function() {
//                        $("#connexion_profil").fadeOut(500);
//                    }, 1000);
//                }
            });

        }
    };

}

