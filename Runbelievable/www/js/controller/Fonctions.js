
function afficherAlerte(titre, msg, type) {
    $(".alert").fadeIn();
    
    $(".alert").html("<h3>"+titre+"</h3><p>"+msg+"</p>");
    
    $(".alert").removeClass("alert-danger");
    $(".alert").removeClass("alert-info");
    $(".alert").removeClass("alert-primary");
    $(".alert").removeClass("alert-warning");
    $(".alert").removeClass("alert-success");
    
    switch(type) {
        case "danger":
            $(".alert").addClass("alert-danger");
            break;
        case "info":
            $(".alert").addClass("alert-info");
            break;
        case "succes":
            $(".alert").addClass("alert-success");
            break;
    }
}

function cacherAlerte() {
    $(".alert").fadeOut();
}
