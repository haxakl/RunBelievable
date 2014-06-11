/**
 * L'objet session contenant les informations d'une session et les differentes formules de lissage et calculs de statistiques. 
 */
function SessionPersonnalises(params) {

    this.nom = "";
    this.listeEtapes = new Array();
    
    if(typeof params !== "undefined") {
        this.nom = params.nom;
        this.listeEtapes = params.listeEtapes;
    }

}
