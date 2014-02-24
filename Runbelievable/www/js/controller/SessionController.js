function SessionController($scope) {

    $scope.liste = [];

    if (!navigator.geolocation) {
        $(".alert").html("<h3>Erreur</h3>Le Gps n'a pas été trouvé.");
        $(".alert").addClass("alert-danger");
    } else {
        $(".alert").html("<h3>Statut</h3>Le Gps a été trouvé.");
        $(".alert").addClass("alert-success");
    }
    
    function onDeviceReady() {
        $(".alert").html("<h3>Statut</h3>La simulation est prête.");
        
        $("#debut_geo").click(function() {
            
            $(this).text("Arrêter la simulation");

            /**
             * Succès de la geolocalisation
             * @param {type} position
             * @returns {undefined}
             */
            function onSuccess(position) {
                $("#geolocalisation").append("<tr><td>" + position.coords.latitude + "</td><td>" + position.coords.longitude + "</td></tr>");
                $(".alert").hide();
            }

            function onError(error) {
                $(".alert").show();
                $(".alert").html("<h3>Erreur " + error.code + "</h3>" + error.message + ".");
                $(".alert").addClass("alert-danger");
            }

            var watch_id = navigator.geolocation.watchPosition(onSuccess, onError, {timeout: 1000});

        });
    }
    
    onDeviceReady();

}