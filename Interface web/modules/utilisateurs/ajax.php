<?php

// Include le moteur
include("../../moteur.php");

// Test le post fonction
$fonction = secuStr($_POST['fonction']);

// Test la fonction
switch ($fonction) {

    // Créer un utilisateur
    case 'newUser':
        echo "Test création utilisateur";
        break;

    // Connexion d'un utilisateur
    case 'connexion':

        // Erreur
        if ($_POST['login'] == "" || $_POST['password'] == "") {
            echo "Erreur: Le login/password ne peut pas être vide";
            die();
        }

        // Ok
        if ($_POST['login'] == "test" || $_POST['password'] == "test") {
            $tmp = array();
            $tmp['login'] = $_POST['login'];
            echo json_encode($tmp);
        } else {
            echo "Erreur: Login/Password incorrect";
        }
        break;

    default:
        echo "Fonction non trouvée : " . $fonction;
        break;
}

die();
