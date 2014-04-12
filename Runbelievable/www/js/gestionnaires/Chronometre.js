
// Gère le chrono
function Chronometre($scope) {

    // Chronometre

    this.start = [];
    this.end = [];
    this.diff = [];
    this.timerID = [];


    this.chrono = function(id) {


        this.end[id] = new Date();
        this.diff[id] = this.end[id] - this.start[id];
        this.diff[id] = new Date(this.diff[id]);

        this.msec = this.diff[id].getMilliseconds();
        this.sec = this.diff[id].getSeconds();
        this.min = this.diff[id].getMinutes();
        this.hr = this.diff[id].getHours() - 1;

        if (this.min < 10) {
            this.min = "0" + this.min;
        }
        if (this.sec < 10) {
            this.sec = "0" + this.sec;
        }
        if (this.msec < 10) {
            this.msec = "00" + this.msec;
        }
        document.getElementById(id).innerHTML = this.hr + ":" + this.min + ":" + this.sec;

        this.timerID[id] = setInterval(function() {
            $scope.gestionnaires.chrono.chrono(id)
        }, 100);
    };
    this.chronoStart = function(id) {
        this.start[id] = new Date();
        this.chrono(id);
    };
    this.chronoContinue = function(id) {
        this.start[id] = new Date() - this.diff[id];
        this.start[id] = new Date(this.start[id]);
        this.chrono(id);
    };
    this.chronoReset = function(id) {
        document.getElementById(id).innerHTML = "0:00:00";
        this.start[id] = new Date();
    };
    this.chronoStopReset = function(id) {
        document.getElementById(id).innerHTML = "0:00:00";
        document.chronoForm.startstop.onclick = chronoStart;
    };
    this.chronoStop = function(id) {
        clearTimeout(this.timerID[id]);
    };
}


