
/**
 * Classe gérant les utilisateurs
 */
function Utilisateurs() {

    this.user = null;

    // Récupérer un utilisateur
    this.connexion = function(login, password) {

        $("#connexion_profil .alert").hide();

        $.post("http://runbelievable.netai.net/modules/utilisateurs/ajax.php", {
            fonction: "connexion",
            login: login,
            password: password
        }).done(function(msg) {
            $("#connexion_profil .alert").fadeIn(500);
            if (msg.indexOf("Erreur: ") !== -1) {
                $("#connexion_profil .alert").html("<i class='fa fa-times'></i> " + msg.replace("Erreur: ", ""));
            } else {
                $("#connexion_profil .alert").removeClass("alert-danger");
                $("#connexion_profil .alert").addClass("alert-success");
                $("#connexion_profil .alert").html("<i class='fa fa-check'></i> Connexion réussi");
                this.user = new Utilisateur(msg);
                $("#menuG .logo .nom").text(this.user.nom);
                $("#menuG .logo .categorie").text(this.user.categorie);
                setTimeout(function() {
                    $("#connexion_profil").fadeOut(500);
                }, 1000);
            }
        });

    };

    // Récupérer un utilisateur
    this.creerProfil = function(params) {

        // Test si le nom est vide
        if (params.nom === "") {
            $("#new_profil .alert").fadeIn(500);
            $("#new_profil .alert").addClass("alert-danger");
            $("#new_profil .alert").html("<i class='fa fa-check'></i> Le nom du profil ne peux pas être vide.");
            return false;
        }

        // Alerte l'utilisateur
        $("#new_profil .alert").fadeIn(500);
        $("#new_profil .alert").removeClass("alert-danger");
        $("#new_profil .alert").addClass("alert-success");
        $("#new_profil .alert").html("<i class='fa fa-check'></i> Création du profil réussi");

        // Crée l'utilisateur
        this.user = new Utilisateur(params);

        // Cache l'alerte après 1/2 seconde
        setTimeout(function() {
            $("#new_profil").fadeOut(500);
        }, 1000);

        // Retourne l'utilisateur
        return this.user;

    };

}
