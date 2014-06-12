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

    case 'saveSession':
        debugPrint(json_decode($_POST['data']));
        
        $json = json_decode($_POST['data']);

        // Récupération de l'utilisateur
        $gestionnaire_user = new Utilisateurs();
        $user = $gestionnaire_user->login($_POST['email']);

        // Creation nouvelle session
        $session = new Session();

        // Mettre les infos dans la session
        $session->user = $user->id;
        $session->nom = $json->nom;
        $session->date = date("Y-m-d H:i:s");
        $session->reference = $json->reference;

        // Sauvegarde
        $session->save();
        $session->lastSave();

        // On boucle sur les acquisitions
        foreach ($json->listeAcquisitions as $acquisition) {
            $donnee = new Donnee();
            $donnee->session = $session->id;
            $donnee->data = json_encode($acquisition);
            $donnee->date = date("Y-m-d H:i:s");
            $donnee->save();
        }
        break;

    // Par défaut
    default:
        echo "Fonction non trouvée : " . $fonction;
        break;
}

die();
