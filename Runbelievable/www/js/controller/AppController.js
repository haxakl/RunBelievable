
function AppController($scope) {

    // Déclaration des gestionnaires
    $scope.gestionnaires = new Array();
    $scope.gestionnaires.menu = new Menu();
    $scope.gestionnaires.utilisateurs = new Utilisateurs();

    window.menu = $scope.gestionnaires.menu;

    // Test si un profil existe
    $scope.user = $.parseJSON(sessionStorage.getItem("profil"));
    if (typeof $scope.user === "undefined" || $scope.user === null) {
        $("#new_profil").fadeIn(500);
        $("#new_profil #new_profil_btn").click(function() {
            var user = $scope.gestionnaires.utilisateurs.creerProfil({
                nom: $("#new_profil #name").val(),
                profil: $("#new_profil #profil").val()
            });
            if (user !== false) {
                $scope.user = user;
                sessionStorage.setItem("profil", JSON.stringify($scope.user));
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
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

    // Création de l'objet session
    $scope.session = new Session();
    
    // La session courrante est celle qui sera affichée dans les statistiques
    $scope.sessionAfficheeStatistiques = $scope.session;

    // Gps actif ou non
    $scope.gps_actif = false;

    // Pour controler l'acquisition de partout 
    $scope.boucleID = null;

    /**
     * Cette variable permet d'accèder à l'icône du Gps
     */
    $scope.icones_gps = $("#icone_gps");

    // Si aucune liste de session n'existe, on en créer une dans le WebStorage
    // TODO remettre le if après la fin des tests
    //if (sessionStorage.getItem("listeSessions") == null) {
    var listeSessions = new Array();
    sessionStorage.setItem("listeSessions", listeSessions);
    //}
    // On récupere la liste des sessions déjà présentes dans le WebStorage
    $scope.listeSession = (Array)(sessionStorage.getItem("listeSessions"));

    /* Petite verification car lors de l'initialisation de la liste, celle-ci lorsqu'elle
     est castée dans le scope est considérée comme possédant un string "" en premier item
     alors qu'elle est effectivement vide */
    if ($scope.listeSession.length == 1) {
        if ($scope.listeSession[0] == "") {
            $scope.listeSession.pop();
        }
    }

    /**
     * Cette variable permet d'accéder au Gps dans tous nos scripts Js.
     * @type Gps
     */
    $scope.gps = new Gps($scope);

    // Menu
    $(".sidebar").click(function() {
        menu.toggleMenuGauche();
    });
    $(".etat").click(function() {
        menu.toggleMenuDroite();
    });
    $("#menuG .liens a").click(function() {
        menu.toggleMenuGauche();
    });

    document.addEventListener("offline", function() {
        console.log("Internet down");
    }, false);

    // Test de la connexion internet
    setInterval(function() {
        $.ajax({
            type: "POST",
            dataType: 'text',
            url: "http://runbelievable.eu.pn/",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            $("#icone_internet").html('<i class="fa fa-cloud"></i><label class="label label-success">Internet activé</label>');
        }).fail(function(xhr, textStatus, errorThrown) {
            $("#icone_internet").html('<i class="fa fa-cloud"></i><label class="label label-danger">Internet désactivé</label>');
        });
    }, 60000);

    /* ***********************
     Mocks de l'application
     *********************** */

    // Ajout de sessions dans la liste des sessions
    var s1 = new Session();
    s1.nom = "Session A";

    var s2 = new Session();
    s2.nom = "Session B";

    var s3 = new Session();
    s3.nom = "Session C";

    $scope.listeSession.push(s1);
    $scope.listeSession.push(s2);
    $scope.listeSession.push(s3);
}
