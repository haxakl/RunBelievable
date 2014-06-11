<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/** @ValueBdd("rb_sessions") * */
class Session extends ClassBdd {

    /** @ValueBdd("ses_id") @Primary("primary") * */
    public $id = -1;

    /** @ValueBdd("ses_nom") * */
    public $nom;

    /** @ValueBdd("ses_user") * */
    public $user;

    /** @ValueBdd("ses_date") * */
    public $date;

    /** @ValueBdd("ses_reference") * */
    public $reference;

    /**
     * Retourne les données de la session
     * @return array Données de la session
     */
    public function getDonnees() {
        $gestionnaire_donnes = new Donnees();
        return $gestionnaire_donnes->getDonneesSession($this->id);
    }

    /**
     * Retourne le nombre de données
     * @return int Nombre de données
     */
    public function nombreDonnees() {
        return count($this->getDonnees());
    }

    /**
     * Retourne la durée de la session
     * @return String Durée de la session
     */
    public function getDuree() {
        $donnees = $this->getDonnees();
        
        $debut = date_create_from_format('Y-m-d H:i:s', $donnees[0]->date);
        $fin = date_create_from_format('Y-m-d H:i:s', $donnees[count($donnees) - 1]->date);
//        return $fin->diff($debut);
        return time_diff($donnees[0]->date, $donnees[count($donnees) - 1]->date);
    }

}
