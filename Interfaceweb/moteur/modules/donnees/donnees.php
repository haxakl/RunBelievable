<?php

// Classe utilisateur
class Donnees {

    /**
     * Create an inaccessible contructor.
     */
    public function __construct() {
    }

    // Récupère tous les utilisateurs
    public function getDonnees() {

        // Prépare la requête
        $requete_user = DB()->prepare("SELECT * FROM rb_donnees ORDER BY don_id DESC");
        $users = exec_sql($requete_user, true);

        $tmp = array();
        foreach ($users as $user) {
            array_push($tmp, new Donnee($user));
        }

        // Crée l'utilisateur
        return $tmp;
    }

    // Récupère tous les utilisateurs
    public function getDonneesSession($idSession) {

        // Prépare la requête
        $requete_user = DB()->prepare("SELECT * FROM rb_donnees WHERE don_session = :session ORDER BY don_id DESC");
        $requete_user->bindParam("session", $idSession);
        $users = exec_sql($requete_user, true);

        $tmp = array();
        foreach ($users as $user) {
            array_push($tmp, new Donnee($user));
        }

        // Crée l'utilisateur
        return $tmp;
    }

}
