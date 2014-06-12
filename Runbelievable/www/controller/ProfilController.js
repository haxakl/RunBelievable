/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function ProfilController($scope) {
    
    function sauvegarderUser() {
        localStorage.setItem("profil", JSON.stringify($scope.user));
    }
    
    $("#profil_etat_civil").click(function() {
        $scope.user.nom = $("#nom").val();
        $scope.user.prenom = $("#prenom").val();
        $scope.user.age = $("#naissance").val();
        $scope.user.sexe =$('input:radio[name=sexe]:checked').val(); 
        $scope.user.email = $("#email").val();
        calcul();
        sauvegarderUser();
     
    });
    
    $("#profil_mensuration").click(function() {
        
        $scope.user.taille = $("#taille").val();
        
        if($scope.user.taille > 3)
            $scope.user.taille = $scope.user.taille/100;
        $scope.user.poids = $("#poids").val();
        $scope.user.poitrine = $("#poitrine").val();
        $scope.user.poignet = $("#poignet").val();
        $scope.user.entrejambe = $("#entrejambe").val();
        $scope.user.souplesse = $("#souplesse").val();

        calcul();
        sauvegarderUser();
    })
    
    $("#profil_habitudes").click(function() {
        $scope.user.course1 = $("#typeCourse1").val();
        $scope.user.course2 = $("#typeCourse2").val();
        $scope.user.course3 = $("#typeCourse3").val();
        $scope.user.pratique = $("#pratique").val();
        $scope.user.situation = $("#situation").val();
        $scope.user.anneePratique = $("#anneePratique").val();  
        $scope.user.nbEntrainement = $("#nbEntrainement").val();
        $scope.user.blessureMusculaire = $("#blessureMusculaire").val();
        $scope.user.blessureAutre = $("#blessureAutre").val();  
        $scope.user.asthmatique = $("#asthmatique").val(); 
        
        calcul();
        sauvegarderUser();
    })
    
    $("#profil_cardio").click(function() {
        $scope.user.FCRepos = $("#FCRepos").val();  
        calcul();
        sauvegarderUser();
    })
    
    $("#profil_cardio").click(function() {
        $scope.user.FCRepos = $("#FCRepos").val();
        calcul();
        sauvegarderUser();
    });
    
    $("#profil_explosivite").click(function() {
        $scope.user.detente = $("#detente").val();
        $scope.user.hauteurMoy = $("#hauteurMoy").val();
        $scope.user.tempsAuSol = $("#tempsAuSol").val();
        $scope.user.frequenceMax = $("#frequenceMax").val();
        $scope.user.pentabond = $("#pentabond").val();
        calcul();
        sauvegarderUser();
    })

    
    $("#profil_allure").click(function() {
        $scope.user.vitesseMax = $("#vitesseMax").val();
        $scope.user.resistance = $("#resistance").val();
        $scope.user.vitesseMaxAnaerobie = $("#vitesseMaxAnaerobie").val();
        $scope.user.puissanceMaxAnaerobie = $("#puissanceMaxAnaerobie").val();
        $scope.user.vitesseMaxAerobie = $("#vitesseMaxAerobie").val();        
        $scope.user.puissanceMaxAerobie = $("#puissanceMaxAerobie").val();
        $scope.user.vitesseAscensionnelle = $("#vitesseAscensionnelle").val();
        calcul();
        sauvegarderUser();
    })

    $("#profil_performance").click(function() {
        $scope.user.cinquante = $("#cinquante").val();
        $scope.user.cent = $("#cent").val();
        $scope.user.deuxcent = $("#deuxcent").val();
        $scope.user.quatrecent = $("#quatrecent").val();
        $scope.user.huitcent = $("#huitcent").val();        
        $scope.user.mille = $("#mille").val();
        $scope.user.millecinqcent = $("#millecinqcent").val();
        
        $scope.user.troismille = $("#troismille").val();
        $scope.user.cinqmille = $("#cinqmille").val();
        $scope.user.dixkils = $("#dixkils").val();
        $scope.user.vingtetunkils = $("#vingtetunkils").val();
        $scope.user.quarantedeuxkils = $("#quarantedeuxkils").val();        
        $scope.user.centkils = $("#centkils").val();
        $scope.user.uneheure = $("#uneheure").val();
        $scope.user.sixheure = $("#sixheure").val();
        $scope.user.vingtquatreheure = $("#vingtquatreheure").val();
        calcul();
        sauvegarderUser();
    })
    
    function calcul(){
        $scope.user.FCMax =  206,9 - 0,67 * $scope.user.age;
        $scope.user.FCAnaerobie =  ($scope.user.FCMax - $scope.user.FCRepos) * 0.8;      
        $scope.user.FCAerobie =  ($scope.user.FCMax - $scope.user.FCRepos) * 0.5;

        $scope.user.imc = $scope.user.poids / ($scope.user.taille * $scope.user.taille);

        
        if($scope.user.sexe == "Homme")
            var s = 1;
        $scope.user.img = ($scope.user.imc *1.20) + (0.23* $scope.user.age) - (10.8*s) - 5.4;
        
        if(isNaN($scope.user.imc))
            $scope.user.imc = "Données manquantes";
        
        if(isNaN($scope.user.img))
            $scope.user.img = "Données manquantes";
        var s = 0;
        

        
        $scope.user.FCMax =  206.9 - 0.67 * $scope.user.age;
        $scope.user.FCAnaerobie =  ($scope.user.FCMax - $scope.user.FCRepos) * 0.8;
        $scope.user.FCAerobie =  ($scope.user.FCMax - $scope.user.FCRepos) * 0.5;
        $scope.user.VO2MAX = 14.49 + 2.143 * $scope.user.vitesseMaxAnaerobie + 0.0324 * ($scope.user.vitesseMaxAnaerobie*$scope.user.vitesseMaxAnaerobie) ;  
        
        if($scope.user.vitesseMaxAnaerobie == "")
            $scope.user.VO2MAX = "";
        
        if($scope.user.age == 0)
            $scope.user.FCMax = "";
        
        if(isNaN($scope.user.FCMax) || $scope.user.FCRepos == ""){
            $scope.user.FCAnaerobie = "";
            $scope.user.FCAerobie = "";
        }
    }
}