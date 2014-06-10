<?php

// Include le moteur
include("../../../moteur.php");

// Test le post fonction
$fonction = secuStr($_POST['fonction']);

// Test la fonction
switch ($fonction) {

    // Nouvelle session
    case 'newSession':
        // Récupération de l'utilisateur
        $gestionnaire_user = new Utilisateurs();
        $user = $gestionnaire_user->login($_POST['email']);

        // Creation nouvelle session
        $session = new Session();

        // Mettre les infos dans la session
        $session->user = $user->id;
        $session->date = date("Y-m-d H:i:s");
        $session->reference = $_POST['reference'];

        // Sauvegarde
        $session->save();

        break;

    // Par défaut
    default:
        echo "Fonction non trouvée : " . $fonction;
        break;
}

die();
