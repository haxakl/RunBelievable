<?php include_once 'header.php'; ?>

<div class="page-header">
    <h3>Sessions</h3>
</div>

<table class='table table-striped'>
    <thead>
        <tr>
            <th>Reference</th>
            <th>User</th>
            <th>Nom</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $gestionnaire_session = new Sessions();
        foreach ($gestionnaire_session->getSessions() as $session) :
            $user = new Utilisateur;
            $user->recup($session->user);
            ?>
            <tr>
                <td><a href="performanceSession.php?session=<?php echo $session->id; ?>"><?php echo $session->reference; ?></a></td>
                <td><?php echo $user->nom; ?></td>
                <td><?php echo $session->nom; ?></td>
                <td><?php echo $session->date; ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php
include_once 'footer.php';
