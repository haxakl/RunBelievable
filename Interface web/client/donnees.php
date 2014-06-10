<?php include_once 'header.php'; ?>

<div class="page-header">
    <h3>Données</h3>
</div>

<table class='table table-striped'>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Données</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $gestionnaire_donnees = new Donnees();
        foreach($gestionnaire_donnees->getDonnees() as $donnee) :
            $user = new Utilisateur();
            $user->recup($donnee->user);
            ?>
        <tr>
            <td><?php echo $user->nom; ?></td>
            <td><?php echo $user->email; ?></td>
            <td><?php echo $donnee->data; ?></td>
            <td><?php echo $donnee->date; ?></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php include_once 'footer.php';