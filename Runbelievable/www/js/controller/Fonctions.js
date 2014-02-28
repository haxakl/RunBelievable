
/* ***********************
    Alertes
   *********************** */

/**
 * Affiche l'alerte.
 * @param {type} titre Titre
 * @param {type} msg Message
 * @param {type} type Type { danger, info, succes }
 */
function afficherAlerte(titre, msg, type) {
    bouton_alerte.show();
    
    bouton_alerte.find("h3").text(titre);
    bouton_alerte.find("p").text(msg);
    
    bouton_alerte.removeClass("alert-danger");
    bouton_alerte.removeClass("alert-info");
    bouton_alerte.removeClass("alert-primary");
    bouton_alerte.removeClass("alert-warning");
    bouton_alerte.removeClass("alert-success");
    
    switch(type) {
        case "danger":
            bouton_alerte.addClass("alert-danger");
            break;
        case "info":
            bouton_alerte.addClass("alert-info");
            break;
        case "succes":
            bouton_alerte.addClass("alert-success");
            break;
    }
}

/**
 * Cache l'alerte.
 */
function cacherAlerte() {
    bouton_alerte.fadeOut(1000);
}
