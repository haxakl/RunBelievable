<?php
include_once 'header.php';

$session = new Session();
$session->recup($_GET['session']);

$duree = $session->getDuree();
$nbDonnees = $session->nombreDonnees();
$distance = round($session->getDistanceParcourue(), 2);
?>

<div class="page-header">
    <h3>Performance de la session</h3>
</div>

<div class="row">
    <div class="col-lg-3">
        <fieldset>
            <legend>Description</legend>
            <p>
                Référence : <?php echo $session->reference; ?>
            </p> 
            <p>
                Id : <?php echo $session->id; ?>
            </p>
            <p>
                Nom : <?php echo $session->nom; ?>
            </p>
            <p>
                Date de la session : <?php echo $session->date ?>
            </p>
        </fieldset>
        <fieldset>
            <legend>Informations</legend>
            <p>
                Durée : <?php echo $duree; ?> secondes
            </p>
            <p>
                Nombre de données : <?php echo $nbDonnees; ?>
            </p>
            <p>
                Vitesse moyenne : <?php echo round($distance*3600/$duree, 2); ?> km/h
            </p>
            <p>
                Distance parcourue : <?php echo $distance; ?> km
            </p>
            <hr>
            <p>
                <?php if ($duree == $nbDonnees - 1) : ?>
                    <span class="label label-success">Toutes les données ont été récupérées</span>
                <?php else: ?>
                    <span class="label label-danger">Pas toutes les données récupérées</span>
                <?php endif; ?>
            </p>
        </fieldset>
    </div>
    <div class="col-lg-9">
        <div style="width: 100%; height: 400px;" id="graph"></div>
        <div class="text-center">
            <h3><b>Vitesse au cours du temps</b></h3>
        </div>
    </div>
</div>

<script>
    (function() {
        var
                container = document.getElementById('graph'),
                start = (new Date).getTime(),
                data, graph, offset, i;

        // Draw a sine curve at time t
        function animate(t) {

            data = [];

            // Sample the sine function
            for (i = 0; i < <?php echo $duree; ?>; i += 0.2) {
                data.push([i, 0]);
            }

            // Draw Graph
            graph = Flotr.draw(container, [data]);

            // Animate
            setTimeout(function() {
                animate((new Date).getTime());
            }, 1000);
        }

        animate(start);
    })();
</script>

<?php
include_once 'footer.php';
