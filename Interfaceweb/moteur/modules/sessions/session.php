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
    
    public $donnees;

    /**
     * Retourne les données de la session
     * @return array Données de la session
     */
    public function getDonnees() {
        if (!isset($this->donnees) || $this->donnees == null) {
            $gestionnaire_donnes = new Donnees();
            $this->donnees = $gestionnaire_donnes->getDonneesSession($this->id);
        }
        
        return $this->donnees;
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
        return time_diff($donnees[0]->date, $donnees[count($donnees) - 1]->date);
    }

    /**
     * Retourne la distance parcourue
     * @return type 
     */
    public function getDistanceParcourue() {
        $donnees = $this->getDonnees();
        $distance = 0;
        for($i = 1; $i < count($donnees) ; $i++) {
            $distance += distance($donnees[$i-1], $donnees[$i]);
        }
        return $distance;
    }
    
    /**
     * Retourne la vitesse dans un intervalle de données
     * @param type $offset1
     * @param type $offset2
     */
    public function getVitesse($offset1, $offset2) {
        $donnees = $this->getDonnees();
        
        $distance = distance($donnees[$offset1], $donnees[$offset2]);
        $duree = time_diff($donnees[$offset1]->date, $donnees[$offset2]->date);
        
        if($duree == 0) {
            return 0;
        }
        
        return round($distance*3600/$duree, 2);
    }
    
}
