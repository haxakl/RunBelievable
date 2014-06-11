/**
 * Controler de la page des statistiques de session
 *
 */
function StatistiquesSessionController($scope) {

    $scope.infoApplication.sessionAfficheeStatistiques.listeDistances = [];

    /**
     * Méthode permettant de lisser les données de la session 
     */
    $scope.lissageSession = function() {
        calculerStats();

        genererStatsResume();
    };

    /**
     * Fonction permettant de calculer les statistiques de la session : 
     * - la distance parcouru totale
     * - la durée de la sesion
     */
    function calculerStats() {
        // Rayon de la terre en km
        r = 6366;

        // On remet les statisiques à 0
        $scope.infoApplication.sessionAfficheeStatistiques.distanceParcouru = 0;
        $scope.infoApplication.sessionAfficheeStatistiques.dureeSession = 0;

        // L'ancien point utilisé dans la boucle
        var ancienPoint = null;

        // On parcourt les acquisitions effectuées
        for (indice in $scope.infoApplication.sessionAfficheeStatistiques.listeAcquisitions) {

            // On recupere le point à parcourir à partir de la liste des acquisitions
            point = $scope.infoApplication.sessionAfficheeStatistiques.listeAcquisitions[indice];

            // Si l'ancien point est null (cas de la prmeiere itération de la boucle), on ne fait pas de calcul
            if (ancienPoint == null) {
                ancienPoint = point;
                continue;
            }

            // On calcule cette distance en km
            distanceEnKm = $scope.gestionnaires.gps.getDistance2Points(ancienPoint.latitude, ancienPoint.longitude,
            	point.latitude, point.longitude);

            // On l'ajoute à la liste des distances
            $scope.infoApplication.sessionAfficheeStatistiques.listeDistances.push(distanceEnKm);

            // Calcul des stats annexes
            $scope.infoApplication.sessionAfficheeStatistiques.distanceParcouru += distanceEnKm;
            $scope.infoApplication.sessionAfficheeStatistiques.dureeSession += ((point.timestamp - ancienPoint.timestamp) / 1000);

            // TODO je rajoute ces infos dans le point de la liste d'acquisition
            $scope.infoApplication.sessionAfficheeStatistiques.listeAcquisitions[indice].distanceEnKm = distanceEnKm;
            $scope.infoApplication.sessionAfficheeStatistiques.listeAcquisitions[indice].duree = ((point.timestamp - ancienPoint.timestamp) / 1000);

            ancienPoint = point;
        }

        // Mise à jour de la vitesse moyenne
        $scope.infoApplication.sessionAfficheeStatistiques.vitesseMoyenne = 3600 * $scope.infoApplication.sessionAfficheeStatistiques.distanceParcouru / $scope.infoApplication.sessionAfficheeStatistiques.dureeSession;

        $scope.infoApplication.sessionAfficheeStatistiques.dureeSessionString = calculerTempsString($scope.infoApplication.sessionAfficheeStatistiques.dureeSession);
    }
    ;


    /**
     * Méthode permettant de former le string de format "XXh YYm ZZs" pour l'affichage' 
     */
    function calculerTempsString($duree) {

        var heures = parseInt($duree / 3600) % 24;
        var minutes = parseInt($duree / 60) % 60;
        var secondes = parseInt($duree % 60);

        var retour = "";

        if (heures > 0)
            retour += heures + "h";

        if (minutes > 0 && heures > 0)
            retour += (minutes < 10 ? "0" + minutes : minutes) + "m";
        else if (minutes > 0)
            retour += minutes + "m";

        if (heures > 0 || minutes > 0)
            retour += (secondes < 10 ? "0" + secondes : secondes) + "s";
        else
            retour += secondes + "s";

        return retour;
    }


    /**
     * Méthode permettant de parcourir la session et de resumé en X points de controles les statistiques 
     */
    function genererStatsResume() {
        // Le nombre de points de controles
        nombreDePointDeControle = 10;

        // Le tableau des stats
        $scope.tableauStats = [];

        // Le nombre d'acquisition à parcourir à chaque point de controle
        nbPointParCtrl = $scope.infoApplication.sessionAfficheeStatistiques.listeAcquisitions.length / nombreDePointDeControle;

        for (i = 0; i < nombreDePointDeControle; i++) {
            // On recupere un sous tableau contenant les acquisitions relatif à un point de controle
            tab = $scope.infoApplication.sessionAfficheeStatistiques.listeAcquisitions.slice(i * nbPointParCtrl, (i + 1) * nbPointParCtrl);

            // On parcourt le sous tableau et on fait les stats
            var distanceParcourue = 0;
            var dureeTotale = 0;

            for (indice in tab) {
                acquisition = tab[indice];

                // Si la distance est Not A number, on continue
                if (isNaN(acquisition.distanceEnKm))
                    continue;

                distanceParcourue += acquisition.distanceEnKm;
                dureeTotale += acquisition.duree;
            }

            // Calcul de la vitesse en km/h
            vitesse = 3600 * distanceParcourue / dureeTotale;

            // Si la vitesse est NaN, on la met à 0 de base
            if (isNaN(vitesse))
                vitesse = 0;

            // On créer l'objet contenant les informations du point de controle
            stats = {
                distance: distanceParcourue,
                duree: dureeTotale,
                vitesseMoyenne: vitesse
            };

            // On ajoute les informations
            $scope.tableauStats.push(stats);

            // Mise à jour de la vitesse Max
            if (vitesse > $scope.infoApplication.sessionAfficheeStatistiques.vitesseMax)
                $scope.infoApplication.sessionAfficheeStatistiques.vitesseMax = vitesse;

            // Mise à jour de la vitesse Min
            if (vitesse < $scope.infoApplication.sessionAfficheeStatistiques.vitesseMin)
                $scope.infoApplication.sessionAfficheeStatistiques.vitesseMin = vitesse;

        }

        dessinerGraphVitesseTemps();
    }

    /*
     * Méthode permettant de dessiner le graphique de vitesse/temps
     */
    function dessinerGraphVitesseTemps() {
        // On vide la div en charge du graph
        $("#VitesseTemps").empty();

        // Création de la liste pour les abscisse (temps) et pour les ordonnées (vitesse)
        absTemps = [];
        ordVit = [];
        var temps = 0;
        for (indice in $scope.tableauStats) {
            // On ajoute le temps
            temps += $scope.tableauStats[indice].duree;
            absTemps.push(temps);

            // On ajoute la vitesse moyenne à ce point
            ordVit.push($scope.tableauStats[indice].vitesseMoyenne);
        }

        // Création de l'objet raphael rataché à la div d'id "VitesseTemps"
        var r = Raphael("VitesseTemps");

        // Création du graphique en ligne
        var chart = r.linechart(
                10, 10, // Position du bord haut gauche
                $("#VitesseTemps").width() - 10, 250, // Position du bord bas droit
                [
                    absTemps       // Absices du temps
                ],
                [
                    ordVit // Ordonnées de la vitesse
                ],
                {
                    nostroke: false, // Ligne entre les points
                    axis: "0 0 1 1", // On dessine les aces en bas et à gauche
                    smooth: false, // Lignes "courbées"
                    shade: true,
                    colors: [
                        "#04B404", // Couleur verte
                    ]
                });


        // On recupere la liste des labels sur la ligne des abscisse
        var abscisse = chart.axis[0].text.items;

        var compteur = 0;

        // On parcourt la liste des labels des abscisse
        for (var i in abscisse) {
            // On change le label
            if (compteur % 3 == 2)
                abscisse[i].attr({'text': calculerTempsString(abscisse[i].attr('text'))});
            else
                abscisse[i].attr({'text': ""});

            compteur++;
        }
        ;
    };
    
    /**
     *Méthode permettant de stocker la session dans la liste des sessions
     */
    $scope.sauvegarderSession = function() {
        $scope.gestionnaires.sessions.sauvegarderSession($("#nomSession").val(), $scope.infoApplication.sessionAfficheeStatistiques, $scope.user);
    };

    $scope.lissageSession();
}