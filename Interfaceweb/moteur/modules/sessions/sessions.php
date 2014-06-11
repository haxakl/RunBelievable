<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Classe Sessions
class Sessions {

    /**
     * Create an inaccessible contructor.
     */
    public function __construct() {
    }

    // Récupère tous les sessions
    public function getSessions() {

        // Prépare la requête
        $requete_session = DB()->prepare("SELECT * FROM rb_sessions");
        $sessions = exec_sql($requete_session, true);

        $tmp = array();
        foreach ($sessions as $session) {
            array_push($tmp, new Session($session));
        }

        // Crée l'utilisateur
        return $tmp;
    }
    
    public function getSessionReference($reference){
        
        // Préparation de la requete
        $requete_session = DB()->prepare("SELECT * FROM rb_sessions WHERE ses_reference = :reference;");
        $requete_session->bindParam(':reference', $reference, PDO::PARAM_STR);
        
        // Retourne le résultat
        $infos = exec_sql($requete_session, true);
        
        // Crée la session
        if (count($infos) == 0) {
            return new Session();
        } else {
            return new Session($infos[0]);
        }
    }

}
