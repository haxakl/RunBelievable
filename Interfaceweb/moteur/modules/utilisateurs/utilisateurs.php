<?php

// Classe utilisateur
class Utilisateurs {

    /**
     * Create an inaccessible contructor.
     */
    public function __construct() {
    }

    // Login d'un utilisateur
    public function login($email) {

        // Prépare la requête
        $requete_user = DB()->prepare("SELECT * FROM rb_users WHERE usr_email = :email;");
        $requete_user->bindParam(':email', $email, PDO::PARAM_STR);

        // Retourne le résultat
        $infos = exec_sql($requete_user, true);

        // Crée l'utilisateur
        if (count($infos) == 0) {
            return new Utilisateur();
        } else {
            return new Utilisateur($infos[0]);
        }
    }

    // Récupère tous les utilisateurs
    public function getUsers() {

        // Prépare la requête
        $requete_user = DB()->prepare("SELECT * FROM rb_users");
        $users = exec_sql($requete_user, true);

        $tmp = array();
        foreach ($users as $user) {
            array_push($tmp, new Utilisateur($user));
        }

        // Crée l'utilisateur
        return $tmp;
    }

    // Récupère tous les utilisateurs
    public function getClients() {

        // Prépare la requête
        $requete_user = DB()->prepare("SELECT * FROM riskat_utilisateurs WHERE usr_type = 'Client'");
        $users = exec_sql($requete_user, true);

        $tmp = array();
        foreach ($users as $user) {
            array_push($tmp, new Utilisateur($user));
        }

        // Crée l'utilisateur
        return $tmp;
    }

    // Récupère les établissements
    public function getEtablissements($idUser) {

        // Prépare la requête
        $requete = DB()->prepare("SELECT ins_nom, usr_nom FROM riskat_installations, riskat_utilisateurs WHERE ins_utilisateur = usr_id AND usr_id = :idUser AND usr_entreprise != ins_id AND ins_utilisateur = 8 AND ins_type = 'Entreprise' ORDER BY ins_nom ASC;");
        $requete->bindParam(':idUser', $idUser, PDO::PARAM_STR);
        $resultat = exec_sql($requete, true);

        // Foreach
        $installations = array();
        foreach ($resultat as $installation) {
            array_push($installations, new Entreprise($installation));
        }

        // Retourne le résultat
        return $installations;
    }

}
