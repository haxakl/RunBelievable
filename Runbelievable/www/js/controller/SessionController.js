/**
 * Controler d'une session.
 * @param {type} $scope Données du controler
 */
function SessionController($scope, Global) {

    var interval_acquisition = 1000;

    $scope.vitesseActuelle = 0;
    $scope.session.dureeSession = 0;
    $scope.session.calorie = 0;

    // TODO Enum pour les textes dispo pour le bouton (à déplacer dans un endroit approprié dans le futur) 
    var dico_bouton_acquisition = {
        STOP: "Intérrompre l'acquisition",
        START: "Démarrer",
        RESTART: "Redémarrer l'acquisition"
    };

    // Texte par défaut
    if ($scope.session.listeAcquisitions.length === 0)
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.START;
    else if ($scope.gestionnaires.gps.gps_acquisition_actif)
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;
    else
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;

    $scope.clickAcquisition = function() {
        if ($scope.gestionnaires.gps.gps_acquisition_actif) {
            stopAcquisition();
        } else {
            lancerAcquisition();
        }
    };

    /**
     * Méthode permettant de localiser l'utilisateur
     * @param {type} item Nouvelles données
     */
    function placerPoint(item) {

        if (!$scope.gestionnaires.gps.actif || item === null) {
            return;
        }

        // maj la location
        Global.location = new google.maps.LatLng(item.latitude, item.longitude);


        if (Global.lastLocation !== null) {
            var tabSegment = [
                Global.lastLocation,
                Global.location
            ];

            var segment = new google.maps.Polyline({
                path: tabSegment,
                geodesic: true,
                strokeColor: '#156AEB',
                strokeOpacity: 0.95,
                strokeWeight: 2
            });

            segment.setMap(Global.map);
        }

        Global.map.setCenter(Global.location);
        Global.lastLocation = Global.location;

        // push dans liste acquisitions
        $scope.session.listeAcquisitions.push(item);

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        $scope.refresh();

    }

    /**
     * Démarre l'acquisition
     */
    function lancerAcquisition() {

        // Test si le Gps n'est pas actif on ne fait rien, et si il n'est pas deja démarré
        if (!$scope.gestionnaires.gps.actif || $scope.gestionnaires.gps.gps_acquisition_actif) {
            return false;
        }
        
        // Lancement du chrono
        chronoContinue();
        
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.STOP;

        // Acquisition démarée
        $scope.gestionnaires.gps.gps_acquisition_actif = true;

        // Boucle de récuperation des données
        $scope.boucleID = setInterval(function() {

            if (!$scope.gestionnaires.gps.actif || !$scope.gestionnaires.gps.gps_acquisition_actif) {
                // On arrete l'acquisition
                clearInterval($scope.boucleID);
            }
            $scope.gestionnaires.gps.getAcquisition(placerPoint);

            calculerVitesseActuelle();
        }, interval_acquisition);
    }

    function calculerVitesseActuelle() {

        if ($scope.session.listeAcquisitions.length > 1) {
            var acquisitonActuelle = $scope.session.listeAcquisitions[$scope.session.listeAcquisitions.length - 1];
            var acquisitonPrecedente = $scope.session.listeAcquisitions[$scope.session.listeAcquisitions.length - 2];

            var distance = $scope.gestionnaires.gps.getDistance2Points(acquisitonActuelle.latitude, acquisitonActuelle.longitude, acquisitonPrecedente.latitude, acquisitonPrecedente.longitude);

            var tempsEntre2Points = (acquisitonActuelle.timestamp - acquisitonPrecedente.timestamp) / 1000;

            $scope.vitesseActuelle = 3600 * distance / tempsEntre2Points;
            $("#vitesseActuelle").text(Math.round($scope.vitesseActuelle, 0));
        }
    }

    /**
     * Arrête l'acquisition
     */
    function stopAcquisition() {
        // Test si le Gps n'est pas actif on ne fait rien, et si l'acquisition n'est pas deja arêtée
        if (!$scope.gestionnaires.gps.actif || !$scope.gestionnaires.gps.gps_acquisition_actif) {
            return false;
        }
        chronoStop();
        $scope.texte_bouton_acquisition = dico_bouton_acquisition.RESTART;

        // Acquisition arêtée
        $scope.gestionnaires.gps.gps_acquisition_actif = false;

        // Recentrer sur dernière pos connue
        Global.map.panTo(Global.location);


    }

    // TODO maj pour maps angular
    function finalizeMap(item, hook) {
        var mapOptions = {
          center: new google.maps.LatLng(item.latitude, item.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // maj la carte
        Global.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        Global.location = item;
       
       // Map chargé
       google.maps.event.addListenerOnce(Global.map, 'idle', function(){
           $scope.resetMap();
       });

        // appeler hook si il y en a un
        if (typeof hook !== "undefined")
            hook();
        else {
            // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
            $scope.refresh();
        }

    }

    // Reset de la map TODO
    $scope.resetMap = function() {

        var markers = $scope.session.listeAcquisitions;

        // On parcourt les acquisitions effectuées
        for (var i = 0; i < markers.length; i++) {

            // maj la position
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(markers[i].latitude, markers[i].longitude),
                map: Global.map,
                title: 'FOUND YO SORRY ASS !!'
            });

        }

        // Si le scope n'est pas déjà en train de mettre à jour la vue, on indique qu'elle doit être mise à jour
        if (!$scope.$$phase) {
            $scope.$apply();
        }

    };

    // Affiche la carte
    $scope.initializeMap = function() {

        // Si gps ok
        if (!$scope.gestionnaires.gps.actif) {
            return false;
        }

        $scope.gestionnaires.gps.getAcquisition(finalizeMap); // Besoin du hook pour initialiser la map sur pos initiale

    };
    
    /**
     * Méthode permettant de sauvegarder la session dans la liste des sessions  et de le rediriger sur les stats de la session
     */
    $scope.sauvegarderSession = function (){
    	$scope.listeSession.push($scope.session);
    	
    	$scope.infoApplication.sessionAfficheeStatistiques = $scope.session;
    	
    	location = "#statistiquesSession";
    	
    };

    // Test si le Gps est allumé    
    $scope.gestionnaires.gps.isEnabled($scope.initializeMap);

}

// Chronometre

var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
function chrono(){
	end = new Date()
	diff = end - start
	diff = new Date(diff)
	var msec = diff.getMilliseconds()
	var sec = diff.getSeconds()
	var min = diff.getMinutes()
	var hr = diff.getHours()-1
	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	document.getElementById("chronotime").innerHTML = hr + ":" + min + ":" + sec 
	timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
	start = new Date()
	chrono()
}
function chronoContinue(){
	start = new Date()-diff
	start = new Date(start)
	chrono()
}
function chronoReset(){
	document.getElementById("chronotime").innerHTML = "0:00:00"
	start = new Date()
}
function chronoStopReset(){
	document.getElementById("chronotime").innerHTML = "0:00:00"
	document.chronoForm.startstop.onclick = chronoStart
}
function chronoStop(){
	clearTimeout(timerID)
}
