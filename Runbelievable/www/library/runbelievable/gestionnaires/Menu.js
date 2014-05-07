
// Gère le menu
function Menu() {

    // Stocke si le menu est ouvert
    this.show = false;

    // Reset le corps
    this.reset = function() {
        $('#header').transition({x: '0px'});
        $('.view').transition({x: '0px'});
        $('#menuD').transition({x: '0px'});
        $('#menuG').transition({x: '0px'});
    };

    // Déplace le corps à gauche
    this.moveLeft = function() {
        $('#header').transition({x: '-270px'});
        $('.view').transition({x: '-270px'});
    };

    // Déplace le corps à gauche
    this.moveRight = function() {
        $('#header').transition({x: '270px'});
        $('.view').transition({x: '270px'});
    };

    // Toogle le menu de gauche
    this.toggleMenuGauche = function() {
        if (this.show) {
            this.reset();
        } else {
            $('#menuG').transition({x: '270px'});
            this.moveRight();
        }
        this.show = !this.show;
    };

    // Toogle le menu de droite
    this.toggleMenuDroite = function() {
        if (this.show) {
            this.reset();
        } else {
            $('#menuD').transition({x: '-270px'});
            this.moveLeft();
        }
        this.show = !this.show;
    };

}

