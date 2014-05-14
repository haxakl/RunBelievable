
/**
 * Controller principal du début de l'application
 * @param {type} $scope
 */
function AppController($scope) {

    // ==========================================================
    //  Déclaration des gestionnaires
    // ==========================================================

    // Déclaration du tableau des gestionnaires
    $scope.gestionnaires = new Array();

    // Déclaration des gestionnaires
    $scope.gestionnaires.menu = new Menu();
    $scope.gestionnaires.utilisateurs = new Utilisateurs();
    $scope.gestionnaires.map = new Map($scope);
    $scope.gestionnaires.gps = new Gps($scope);
    $scope.gestionnaires.accelerometre = new Accelerometre($scope);
    $scope.gestionnaires.navigator = navigator;

    // Configuration de l'application
    $scope.icones_gps = $("#icone_gps");
    $scope.icone_accelerometre = $("#icone_accelerometre");

    // ==========================================================
    //  Fonctions stockées dans le scope
    // ==========================================================

    // Permet de refresh l'application
    $scope.refresh = function() {

        // Si le scope n'est pas entrain de rafraichir on force le 
        // rafraichissement.
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    };


    // Permet d'afficher une alerte 
    $scope.alerte = function(texte) {
        $("#alerte #contenuAlerte").text(texte);

        $("#alerte").fadeIn(500);

        // Fermeture d'alerte
        $(document).click(function() {
            $("#alerte").fadeOut(500);

            $(document).unbind('click');
        });
    }

    // Permet de tester l'internet
    $scope.testerInternet = function() {

        // Récupération du type de connection
        if (navigator.connection) {
            var type = navigator.connection.type;
        } else if (navigator.network) {
            var type = navigator.network.connection.type;
        } else {
            $scope.isInternet = true;

            return true;
        }

        // Test s'il y a une connection
        if (type === Connection.NONE) {
            $scope.isInternet = false;
            $("#icone_internet").html('<i class="fa fa-cloud"></i><label class="label label-danger">Internet désactivé</label>');
            return false;
        } else {
            $scope.isInternet = true;
            $("#icone_internet").html('<i class="fa fa-cloud"></i><label class="label label-success">Internet activé</label>');
            return true;
        }

    };

    // Le gps récupère les données
    $scope.boucleGps = function() {
        $scope.gestionnaires.gps.getAcquisition();
    };

    // L'accéléromètre récupère les données
    $scope.boucleAccelerometre = function() {
        $scope.gestionnaires.accelerometre.getAcquisition();
    };

    // Permet de déclencher les alertes 
    $scope.alerterEtat = function() {
        if (!$scope.infoApplication.Global.alertTriggered.gps && !$scope.gestionnaires.gps.actif) {
            $scope.alerte("Le gps a été désactivé.");
            $scope.infoApplication.Global.alertTriggered.gps = true;
        }
        if (!$scope.infoApplication.Global.alertTriggered.internet && !$scope.isInternet) {
            $scope.alerte("Connexion à Internet perdue.");
            $scope.infoApplication.Global.alertTriggered.internet = true;
        }
        if (!$scope.infoApplication.Global.alertTriggered.accelerometre && !$scope.gestionnaires.accelerometre.actif) {
            $scope.alerte("L'acceleromètre a été désactivé.");
            $scope.infoApplication.Global.alertTriggered.accelerometre = true;

        }

    }

    // ==========================================================
    //  Intervals et Timeouts stockées dans le scope
    //  @description Les timeouts et les intervals sont mieux ici car les fuites
    //  de mémoires dans cordova viennent principalement de ces deux éléments. 
    //  On doit pouvoir récupérer très rapidement ces deux éléments.
    // ==========================================================

    // Intervals
    $scope.interval = new Array();

    // Timeouts
    $scope.timeout = new Array();

    // ==========================================================
    //  Déclaration de l'entité contenant les informations de fonctionnement
    // de l'applciation
    // ==========================================================
    $scope.infoApplication = new InfoApplication();

    // ==========================================================
    //  Test du chargement en début
    // ==========================================================

    // Récupération du profil de la session storage
    $scope.user = $.parseJSON(localStorage.getItem("profil"));

    // On regarde si on a récupéré un utilisateur du session storage.
    // Si ce n'est pas le cas alors on considère qu'il n'y a pas de profil 
    // stocké sur le téléphone.
    // La récupération de profil (s'il a été perdu) ne se fera que si le profil 
    // a été enregistré sur le serveur en ligne.
    if (typeof $scope.user === "undefined" || $scope.user === null) {

        // Affiche la création de profil
        $("#new_profil").fadeIn(500);

        // On lie le bouton à la création d'un nouvel utilisateur
        $("#new_profil #new_profil_btn").click(function() {
            var user = $scope.gestionnaires.utilisateurs.creerProfil({
                nom: $("#new_profil #name").val(),
                profil: $("#new_profil #profil").val()
            });

            // Si l'utilisateur a bien été crée on le stocke dans l'application
            // et dans le session storage.
            if (user !== false) {
                $scope.user = user;
                localStorage.setItem("profil", JSON.stringify($scope.user));
                $scope.refresh();
            }
        });

    }

    // =========================================================
    //  Début de la création d'une session
    // ==========================================================

    // Création de l'objet session en cours
    $scope.session = new Session();

    // Boolean de surveillance de la pause
    $scope.enPause = false;

    // Pour controler l'acquisition de partout 
    $scope.boucleID = null;

    // Si aucune liste de session n'existe, on en crée une dans le WebStorage
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
    if ($scope.listeSession.length === 1) {
        if ($scope.listeSession[0] === "") {
            $scope.listeSession.pop();
        }
    }

    // ==========================================================
    //  Gestion des deux menus
    // ==========================================================

    // Click d'affichage et de fermeture du menu de gauche
    $(".sidebar").click(function() {
        $scope.gestionnaires.menu.toggleMenuGauche();
    });

    // Click d'affichage et de fermeture du menu de droite
    $(".etat").click(function() {
        $scope.gestionnaires.menu.toggleMenuDroite();
    });

    // Lorsqu'on clique sur un lien du menu le menu se ferme
    $("#menuG .liens a").click(function() {
        $scope.gestionnaires.menu.toggleMenuGauche();
    });

    // Lorsqu'on clique sur un lien du menu le menu se ferme
    $("#menuD .liens a").click(function() {
        $scope.gestionnaires.menu.toggleMenuDroite();
    });

    // ==========================================================
    //  Tester les deux modules important de notre application : l'accès à 
    //  Internet et l'accès au Gps
    // ==========================================================

    // Nouvel interval de 5 secondes
    var interval_etat = setInterval(function() {
        $scope.boucleGps();
        $scope.boucleAccelerometre();
        if ($scope.testerInternet())
            $scope.infoApplication.Global.alertTriggered.internet = false;


        $scope.alerterEtat();
        $scope.refresh();
    }, 5000);

    // On l'ajoute dans les intervals stockées
    $scope.interval.push(interval_etat);

    // ==========================================================
    //  Tests des sessions
    //  @ASupprimer quand le module sera codé
    // ==========================================================

    // Ajout de sessions dans la liste des sessions
    var s1 = new Session();
    s1.nom = "Session A";
    s1.dureeSessionString = "57m 25s";

    var s2 = new Session();
    s2.nom = "Session B";
    s2.dureeSessionString = "3h 03m 42s";

    var s3 = new Session();
    s3.nom = "Session C";
    s3.dureeSessionString = "1h 23m 52s";

    $scope.listeSession.push(s1);
    $scope.listeSession.push(s2);
    $scope.listeSession.push(s3);

    // ==========================================================
    //  Tests des états au début de l'application
    //  @description On test directement si on a le gps et internet. Si ce n'est
    //  pas le cas on demande à l'utilisateur de les allumer.
    // ==========================================================


    // Tests de fonctionnement initiaux
    $scope.testerInternet();
    $scope.boucleGps();
    $scope.boucleAccelerometre();
    $scope.alerterEtat();
    $scope.refresh();



}
