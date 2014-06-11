<?php

// Include le moteur
include("../../../moteur.php");

// Test le post fonction
$fonction = secuStr($_POST['fonction']);

// Test la fonction
switch ($fonction) {

    // Connexion d'un utilisateur
    case 'connexion':
        $gestionnaire_user = new Utilisateurs();
        $user = $gestionnaire_user->login($_POST['email']);
        if($user->id == -1) {
            echo "Erreur";
        } else {
            if(md5($_POST['password']) == $user->password) {
                echo "OK";
            } else {
                echo "Erreur";
            }
        }
        break;

    // Inscription d'un utilisateur
    case 'inscription':
        $utilisateur = new Utilisateur();
        $utilisateur->nom = $_POST['nom'];
        $utilisateur->password = md5($_POST['password']);
        $utilisateur->email = $_POST['email'];
        $utilisateur->save();
        break;
    
    // Par défaut
    default:
        echo "Fonction non trouvée : " . $fonction;
        break;
}

die();
