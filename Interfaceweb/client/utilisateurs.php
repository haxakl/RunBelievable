<?php include_once 'header.php'; ?>

<div class="page-header">
    <h3>Utilisateurs</h3>
</div>

<table class='table table-striped'>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Nombre de sessions</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $gestionnaire_user = new Utilisateurs();
        foreach($gestionnaire_user->getUsers() as $user) : ?>
        <tr>
            <td><?php echo $user->nom; ?></td>
            <td><?php echo $user->email; ?></td>
            <td></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php include_once 'footer.php';