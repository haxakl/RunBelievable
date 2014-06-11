
/**
 * Classe gérant les utilisateurs
 */
function Utilisateur(json) {
    
    // Informations de l'utilisateur
    this.idUser = -1;
    
    // Nom de l'utilisateur
    this.nom = "";
    
    // Prénom de l'utilisateur
    this.prenom = "";
    
    // Âge de l'utilisateur
    this.age = "";
    
    // Sexe de l'utilisateur
    this.sexe = "";
    
    // Taille de l'utilisateur
    this.taille ="";
    
    // Poids de l'utilisateur
    this.poids ="";
    
    // IMC de l'utilisateur
    this.imc ="";
    
    // IMG de l'utilisateur
    this.img = "";
    
    // Tour de poignet de l'utilisateur
    this.poignet ="";
    
    // Tour de poitrine de l'utilisateur
    this.poitrine ="";
    
    // Hauteur de l'entrejambe de l'utilisateur
    this.entrejambe ="";
    
    // Souplesse de l'utilisateur
    this.souplesse ="";
    
    // Type de course 1
    this.course1 ="Non renseigné"
    
    // Type de course 2
    this.course2 ="Non renseigné"
    
    // Type de course 3
    this.course3 ="Non renseigné"
    
    // Type de pratique
    this.pratique=""
    
    // Type de situation
    this.situation=""
    
    // Nombre d'années de pratique
    this.anneePratique ="";
    
    // Nombre d'entrainement par semaine
    this.nbEntrainement ="";
    
    // Blessure musculaire
    this.blessureMusculaire ="";
    
    // Blessure autre
    this.blessureAutre ="";
    
    //Asthmatique
    this.asthmatique ="";
    
    // FC au repos
    this.FCRepos ="";
    
    // FC max
    this.FCMax ="";
    
    // FC anaérobie
    this.FCAnaerobie ="";
    
    // FC aerobie
    this.FCAerobie ="";
    
    // VO2MAX
    this.VO2MAX ="";

    // Détente seche
    this.detente="";

    // Qualité de pied
    this.hauteurMoy="";
    this.tempsAuSol="";
    
    // Frequence maximal de mouvement
    this.frequenceMax ="";
    
    // Pentabond
    this.pentabond ="";
    
    // Vitesse max (sprint)
    this.vitesseMax="";
    
    // Resistance vitesse
    this.resistance="";
 
    // VMA
    this.vitesseMaxAnaerobie="";
    
    // PMA
    this.puissanceMaxAnaerobie="";
    
    // Vitesse max aerobie
    this.vitesseMaxAerobie="";
    
    // Puissance max aeoribie
    this.puissanceMaxAerobie="";
    
    // Vitesse ascensionnelle
    this.vitesseAscensionnelle="";
    
    // 50m
    this.cinquante="";
    
    //100 m
    this.cent="";
    
    // 200m
    this.deuxcent="";

    // 400m
    this.quatrecent="";
    
    // 800m
    this.huitcent="";
    
    // 1000m
    this.mille="";

    // 1500m
    this.millecinqcent ="";
    
    // 3000m
    this.troismille ="";
    
    // 5000m
    this.cinqmille ="";
    
    // 10km
    this.dixkils="";
    
    // 21km
    this.vingtetunkils="";
    
    // 42km
    this.quarantedeuxkils="";
    
    // 100km
    this.centkils="";
    
    // 1h
    this.uneheure="";
     
    // 6h
    this.sixheure="";
    
    //24h
    this.vingtquatreheure="";

    // Photo de l'utilisateur
    this.photo = "";
    
    // Liste d'acquisition de l'utilisateur
    this.listeAcquisition = null;
    
    
    
    // Catégorie de l'utilisateur
    this.categorie = "Amateur";
    
    // Test si un json est défini
    if(json) {
        this.nom = json.nom;
        this.categorie = json.profil;
    }
    
}
