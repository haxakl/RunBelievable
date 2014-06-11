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
        foreach ($gestionnaire_donnees->getDonnees() as $donnee) :
            $session = new Session();
            $session->recup($donnee->session);
            $user = new Utilisateur();
            $user->recup($session->user);
            ?>
            <tr>
                <td><?php echo $user->nom; ?></td>
                <td><?php echo $session->reference; ?></td>
                <td>
                    <?php foreach (json_decode($donnee->data) as $key => $datas) : ?>
                    <span style="display: block; margin-bottom: 10px;" class="label label-primary"><?php echo $key.": ".$datas; ?></span>
                    <?php endforeach; ?>
                </td>
                <td><?php echo $donnee->date; ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php
include_once 'footer.php';
