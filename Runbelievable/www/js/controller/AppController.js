
function AppController($scope) {

    // Déclaration des gestionnaires
    $scope.gestionnaires = new Array();
    $scope.gestionnaires.utilisateurs = new Utilisateurs();

    // Test si un profil existe
    if (typeof $scope.user === undefined) {
        $("#connexion_profil").fadeIn(500);
        $("#connexion_profil #log_in").click(function() {
            $scope.gestionnaires.utilisateurs.connexion(
                    $("#connexion_profil input[name='nom']").val(),
                    $("#connexion_profil input[name='password']").val());
        });
    }

    /* ***********************
     Alertes
     *********************** */

    // div d'alerte
    $scope.bouton_alerte = $("#module_alerte");

    /**
     * Affiche l'alerte.
     * @param {type} titre Titre
     * @param {type} msg Message
     * @param {type} type Type { danger, info, succes }
     */
    $scope.afficherAlerte = function(titre, msg, type) {
        $scope.bouton_alerte.show();

        $scope.bouton_alerte.find("h3").text(titre);
        $scope.bouton_alerte.find("p").text(msg);

        $scope.bouton_alerte.removeClass("alert-danger");
        $scope.bouton_alerte.removeClass("alert-info");
        $scope.bouton_alerte.removeClass("alert-primary");
        $scope.bouton_alerte.removeClass("alert-warning");
        $scope.bouton_alerte.removeClass("alert-success");

        switch (type) {
            case "danger":
                $scope.bouton_alerte.addClass("alert-danger");
                break;
            case "info":
                $scope.bouton_alerte.addClass("alert-info");
                break;
            case "succes":
                $scope.bouton_alerte.addClass("alert-success");
                break;
        }


    };

    /**
     * Cache l'alerte.
     */
    $scope.cacherAlerte = function() {
        $scope.bouton_alerte.fadeOut(1000);
    };

    /**
     *Méthode permettant de configurer le bouton retour à l'écran précédent
     */
    $scope.configurerRetour = function(route) {
        // On configure le href pour se rendre à l'écran désiré
        $("#retour").attr("href", "#" + route);

        // On retire toutes les anciennes fonctions liées
        $("#retour").unbind();

        // Lors d'un click, on va changer d'écran et cacher le bouton
        $("#retour").bind("click", function() {
            $scope.menu = route;
            $("#retour").hide();
        });

        // On affiche le bouton
        $("#retour").show();
    };

    // Création de l'objet session
    $scope.session = new Session();

    // Gps actif ou non
    $scope.gps_actif = false;

    // Pour controler l'acquisition de partout 
    $scope.boucleID = null;

    /**
     * Cette variable permet d'accèder à l'icône du Gps
     */
    $scope.icones_gps = $("#icone_gps");

    // Si aucune liste de session n'existe, on en créer une dans le WebStorage
    if (sessionStorage.getItem("listeSessions") == null) {
        var listeSessions = [];
        sessionStorage.setItem("listeSessions", listeSessions);
    }
    // On récupere la liste des sessions dans le WebStorage
    $scope.listeSession = sessionStorage.getItem("listeSessions");

    /**
     * Cette variable permet d'accéder au Gps dans tous nos scripts Js.
     * @type Gps
     */
    $scope.gps = new Gps($scope);

}
