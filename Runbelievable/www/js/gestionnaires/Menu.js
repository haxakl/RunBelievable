
// Gère le menu
function Menu() {

    // Stocke si le menu est ouvert
    this.show = false;

    // Toogle le menu
    this.toggleMenu = function() {
        if (this.show) {
            $("#menuG").css("left", "-270px");
            $("#header").css("left", "0px");
            $(".view").css("left", "0px");
        } else {
            $("#menuG").css("left", "0px");
            $("#header").css("left", "270px");
            $(".view").css("left", "270px");
        }
        this.show = !this.show;
    };

}

