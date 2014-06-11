<?php

// Include le moteur
include("../../../moteur.php");

// Test le post fonction
$fonction = secuStr($_POST['fonction']);

// Test la fonction
switch ($fonction) {

    // Connexion d'un utilisateur
    case 'saveDonnees':
        if ($_POST['data'] != "") {
            $donnee = new Donnee();
            $gestionnaire_session = new Sessions();
            $session = $gestionnaire_session->getSessionReference($_POST['reference']);
            $donnee->session = $session->id;
            $donnee->data = $_POST['data'];
            
            $infos = json_decode($_POST['data']);
            
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
