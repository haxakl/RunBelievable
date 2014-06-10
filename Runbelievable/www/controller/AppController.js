
/**
 * Controller principal du début de l'application
 * @param {type} $scope
 */
function AppController($scope, $location) {

    // Chargement
    $scope.chargement = function() {
        $("#chargement").fadeIn(200);
    };
    // Fin chargement
    $scope.finchargement = function() {
        $("#chargement").fadeOut(200);
    };

    $scope.chargement();
    $.support.cors = true;
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

    // Configuration
    $scope.donneesTraitees = new DonneesTraitees($scope);
    $scope.icones_gps = $("#icone_gps");
    $scope.icone_accelerometre = $("#icone_accelerometre");
    // ==========================================================
    //  Fonctions stockées dans le scope
    // ==========================================================

    // Permet d'afficher une alerte 
    $scope.alerte = function(texte) {
        $("#alerte #contenuAlerte").text(texte);
        $("#alerte").fadeIn(500);
        // Fermeture d'alerte
        $(document).click(function() {
            $("#alerte").fadeOut(500);
            $(document).unbind('click');
        });
    };
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
            $("#icone_internet").html('<i class="fa fa-globe"></i><label class="label label-danger">Internet désactivé</label>');
            return false;
        } else {
            $scope.isInternet = true;
            $("#icone_internet").html('<i class="fa fa-globe"></i><label class="label label-success">Internet activé</label>');
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
    // Nouvelle session
    $scope.nouvelleSession = function() {
        $scope.session = new Session();
    };
    // Permet de refresh l'application
    $scope.refresh = function() {

        // Si le scope n'est pas entrain de rafraichir on force le 
        // rafraichissement.
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    };
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
    if (localStorage.getItem("listeSessions") === null) {
        localStorage.setItem("listeSessions", new Array());
    }

// On récupere la liste des sessions déjà présentes dans le WebStorage
    $scope.listeSession = (Array)(localStorage.getItem("listeSessions"));
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
        $scope.testerInternet();
        $scope.refresh();
    }, 5000);
    // On l'ajoute dans les intervals stockées
    $scope.interval.push(interval_etat);
    // ==========================================================
    //  Tests des états au début de l'application
    //  @description On test directement si on a le gps et internet. Si ce n'est
    //  pas le cas on demande à l'utilisateur de les allumer.
    // ==========================================================


    // Tests de fonctionnement initiaux
    $scope.testerInternet();
    $scope.boucleGps();
    $scope.boucleAccelerometre();
    $scope.refresh();
    // ==========================================================
    //  Gestion des comptes
    //  - Profil Local
    //  - Profil Online
    // ==========================================================

    // Fonction création d'un profil
    $scope.creationProfil = function(params) {
        var user = new Utilisateur();
        user.nom = $("#nom").val();
        
        // Si l'utilisateur a bien été crée on le stocke dans l'application et dans le session storage.
        if (user !== false) {
            $scope.first = true;
            $scope.user = user;
            localStorage.setItem("profil", JSON.stringify($scope.user));
            $location.path("/compte");
        }
    };
    // Connexion local
    $scope.connexionLocal = function() {

        // Récupération du profil de la session storage
        if (localStorage.getItem("profil") && localStorage.getItem("profil") !== null) {
            $scope.first = true;
            $scope.user = $.parseJSON(localStorage.getItem("profil"));
            $location.path("/home");
        } else {
            $location.path("/compte/local");
        }
    };
    // Inscription online
    $scope.inscription = function() {
        $scope.chargement();
        $.post("http://runbelievable.netai.net/moteur/modules/utilisateurs/ajax.php", {
            fonction: "inscription",
            nom: $scope.user.nom,
            email: $("#email").val(),
            password: $("#password").val()
        }).done(function() {
            $scope.user.email = $("#email").val();
            localStorage.setItem("profil", JSON.stringify($scope.user));
            $scope.connexionLocal();
        });
    };
    // Connexion online
    $scope.connexion = function() {
        $scope.chargement();
        $.post("http://runbelievable.netai.net/moteur/modules/utilisateurs/ajax.php", {
            fonction: "connexion",
            email: $("#email").val(),
            password: $("#password").val()
        }).done(function(msg) {
            if (msg === "OK") {
                $scope.user.email = $("#email").val();
                localStorage.setItem("profil", JSON.stringify($scope.user));
                $scope.connexionLocal();
            } else {
                $scope.finchargement();
                $(".popup .alert").html("Erreur de connexion");
                $(".popup .alert").fadeIn(200);
            }
        });
    };

    if (!$scope.first) {
        // ==========================================================
        //  Départ de l'application
        //  - Profil Local
        //  - Profil Online
        // ==========================================================
        
        // Debug
//        localStorage.removeItem("profil");
        
        if (localStorage.getItem("profil") && localStorage.getItem("profil") !== null) {
            $scope.user = $.parseJSON(localStorage.getItem("profil"));
            if ($scope.user.email && $scope.user !== "") {
                $location.path("/compte/login");
            } else {
                $location.path("/compte/inscription");
            }
        } else {
            $location.path("/compte/local");
        }
    }

    $scope.finchargement();
}