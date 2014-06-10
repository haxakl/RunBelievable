<?php

/** @ValueBdd("rb_donnees") * */
class Donnee extends ClassBdd {

    /** @ValueBdd("don_id") @Primary("primary") * */
    public $id = -1;

    /** @ValueBdd("don_session") * */
    public $session;

    /** @ValueBdd("don_data") * */
    public $data;

    /** @ValueBdd("don_date") * */
    public $date;

}
