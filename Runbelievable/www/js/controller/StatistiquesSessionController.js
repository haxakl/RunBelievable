/**
 * Controler de la page des statistiques de session
 *
 */
function StatistiquesSessionController($scope) {

    $scope.session.listeDistances = [];

    /**
     * Méthode permettant de lisser les données de la session 
     */
    $scope.lissageSession = function() {
        calculerStats();

        genererStatsResume();
    };

    /**
     * Méthode convertissant un nombre en degrès vers un nombre en radians
     * @param {Object} nombre
     */
    function toRad(nombre) {
        return nombre * Math.PI / 180;
    }
    ;

    /**
     * Fonction permettant de calculer les statistiques de la session : 
     * - la distance parcouru totale
     * - la durée de la sesion
     */
    function calculerStats() {
        // Rayon de la terre en km
        r = 6366;

        // On remet les statisiques à 0
        $scope.session.distanceParcouru = 0;
        $scope.session.dureeSession = 0;

        // L'ancien point utilisé dans la boucle
        var ancienPoint = null;

        // On parcourt les acquisitions effectuées
        for (indice in $scope.session.listeAcquisitions) {

            // On recupere le point à parcourir à partir de la liste des acquisitions
            point = $scope.session.listeAcquisitions[indice];

            // Si l'ancien point est null (cas de la prmeiere itération de la boucle), on ne fait pas de calcul
            if (ancienPoint == null) {
                ancienPoint = point;
                continue;
            }

            //Conversion des latitudes/longitudes en degrés vers du radian
            lat1 = toRad(ancienPoint.latitude);
            lon1 = toRad(ancienPoint.longitude);
            lat2 = toRad(point.latitude);
            lon2 = toRad(point.longitude);

            // On recupere la distance direct entre les deux coordonées GPS
            distance = distanceDirect2Points(lat1, lon1, lat2, lon2);

            // On calcule cette distance en km
            distanceEnKm = distance * r;

            // On l'ajoute à la liste des distances
            $scope.session.listeDistances.push(distanceEnKm);

            // Calcul des stats annexes
            $scope.session.distanceParcouru += distanceEnKm;
            $scope.session.dureeSession += ((point.timestamp - ancienPoint.timestamp) / 1000);

            // TODO je rajoute ces infos dans le point de la liste d'acquisition
            $scope.session.listeAcquisitions[indice].distanceEnKm = distanceEnKm;
            $scope.session.listeAcquisitions[indice].duree = ((point.timestamp - ancienPoint.timestamp) / 1000);

            ancienPoint = point;
        }

        // Mise à jour de la vitesse moyenne
        $scope.session.vitesseMoyenne = 3600 * $scope.session.distanceParcouru / $scope.session.dureeSession;

        $scope.session.dureeSessionString = calculerTempsString($scope.session.dureeSession);
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

        if (secondes > 0 && (heures > 0 || minutes > 0))
            retour += (secondes < 10 ? "0" + secondes : secondes) + "s";
        else if (secondes > 0)
            retour += secondes + "s";


        //return (heures < 10 ? "0" + heures : heures) + "h" + (minutes < 10 ? "0" + minutes : minutes) + "m" + (secondes  < 10 ? "0" + secondes : secondes) + "s";
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
        nbPointParCtrl = $scope.session.listeAcquisitions.length / nombreDePointDeControle;

        for (i = 0; i < nombreDePointDeControle; i++) {
            // On recupere un sous tableau contenant les acquisitions relatif à un point de controle
            tab = $scope.session.listeAcquisitions.slice(i * nbPointParCtrl, (i + 1) * nbPointParCtrl);

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
            if (vitesse > $scope.session.vitesseMax)
                $scope.session.vitesseMax = vitesse;

            // Mise à jour de la vitesse Min
            if (vitesse < $scope.session.vitesseMin)
                $scope.session.vitesseMin = vitesse;

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
                    smooth: true, // Lignes "courbées"
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
    }


    function distanceDirect2Points(lat1, lon1, lat2, lon2) {
        return 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * (Math.pow(Math.sin(((lon1 - lon2) / 2)), 2))));
    }
    ;

    $scope.lissageSession();

    // On affiche le bouton de retour
    $scope.configurerRetour('home');
}