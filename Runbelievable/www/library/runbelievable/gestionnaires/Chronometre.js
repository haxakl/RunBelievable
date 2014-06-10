
// Gère le chrono
function Chronometre($scope, id) {

    // Chronometre

    this.idChrono = id;
    this.start = new Date();
    this.end = 0;
    this.diff = 0;
    this.timerID;


    this.chrono = function() {


        this.end = new Date();
        this.diff = this.end - this.start;
        this.diff = new Date(this.diff);

        this.msec = this.diff.getMilliseconds();
        this.sec = this.diff.getSeconds();
        this.min = this.diff.getMinutes();
        this.hr = this.diff.getHours() - 1;

        if (this.min < 10) {
            this.min = "0" + this.min;
        }
        if (this.sec < 10) {
            this.sec = "0" + this.sec;
        }
        if (this.msec < 10) {
            this.msec = "00" + this.msec;
        }

        if (this.idChrono && this.idChrono !== null) {
            document.getElementById(this.idChrono).innerHTML = this.hr + ":" + this.min + ":" + this.sec;
        }

        if (this.idChrono === "chronotime") {
            this.timerID = setTimeout(function() {
                $scope.chronoPrincipal.chrono()
            }, 50);
        }

        else if (this.idChrono === "pauseTime") {
            this.timerID = setTimeout(function() {
                $scope.chronoPause.chrono()
            }, 50);
        }
    };

    this.chronoStart = function() {
        this.start = new Date();
        this.chrono();
    };

    this.chronoContinue = function() {
        this.start = new Date() - this.diff;
        this.start = new Date(this.start);
        this.chrono();
    };

    this.chronoReset = function() {
        if (this.idChrono && this.idChrono !== null) {
            document.getElementById(this.idChrono).innerHTML = "0:00:00";
        }
        this.start = new Date();
    };
    
    this.chronoStop = function() {
        clearTimeout(this.timerID);
    };

    this.getTime = function() {
        return new Date(this.diff);
    };
}


