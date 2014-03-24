<?php

// Include le moteur
include("../../moteur.php");

// Test le post fonction
$fonction = securedString($_POST['fonction']);
echo "ok";
// Test la fonction
switch($fonction) {
    
    // Créer un utilisateur
    case 'newUser':
        echo "Test création utilisateur";
        break;
    
}

die();
