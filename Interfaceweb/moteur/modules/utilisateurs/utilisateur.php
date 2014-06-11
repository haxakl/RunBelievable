<?php

/** @ValueBdd("rb_users") * */
class Utilisateur extends ClassBdd {

    /** @ValueBdd("usr_id") @Primary("primary") * */
    public $id = -1;

    /** @ValueBdd("usr_nom") * */
    public $nom;

    /** @ValueBdd("usr_password") * */
    public $password;
    
    /** @ValueBdd("usr_email") * */
    public $email;
    
    public function nombreSessions() {
        return 0;
    }
    
}
