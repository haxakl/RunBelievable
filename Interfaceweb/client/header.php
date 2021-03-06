<?php $root = "../"; include_once '../moteur.php'; ?>

<!DOCTYPE !html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>RunBelievable</title>

        <!-- Font -->
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
        
        <!-- Feuilles de styles -->
        <link rel="stylesheet" type="text/css" href="/moteur/librairie/bootstrap/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="/ressources/styles/style.css" />
        
        <!-- Librairies JS -->
        <script src="/moteur/librairie/jquery/jquery.js"></script>
        <script src="/moteur/librairie/flotr/flotr.js"></script>
    </head>
    <body class="container">
        <nav class="navbar navbar-default" role="navigation">
            <ul class="nav navbar-nav">
                <li><a href="index.php">Accueil</a></li>
                <li><a href="utilisateurs.php">Liste des utilisateurs</a></li>
                <!--<li><a href="sessions.php">Liste des sessions</a></li>-->
                <li><a href="donnees.php">Liste des donnees</a></li>
                <li><a href="sessions.php">Liste des sessions</a></li>
            </ul>
        </nav>