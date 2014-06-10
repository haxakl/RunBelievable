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
    
}