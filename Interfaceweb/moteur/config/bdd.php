<?php

// Connexion à la base de données
function DB() {

    // Base de données
    $PARAM_hote = 'mysql.2freehosting.com';
    $PARAM_utilisateur = 'u428167889_rb';
    $PARAM_nom_bd = 'u428167889_rb';
    $PARAM_mot_passe = 'rb2014';

    try {
        $DB = new Pdo('mysql:host=' . $PARAM_hote . ';dbname=' . $PARAM_nom_bd, $PARAM_utilisateur, $PARAM_mot_passe);
        $DB->exec('SET NAMES utf8');
        $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        debugPrint($e);
        die();
    }

    return $DB;
}
