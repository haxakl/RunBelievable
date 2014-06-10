<?php
include_once 'header.php';

// TODO Récupérerer la session
// Création + récupération de la session
$session = new Session();
$session->recup($_GET['session']);
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
    </div>
</div>

<?php
include_once 'footer.php';
