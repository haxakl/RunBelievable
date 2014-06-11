<?php

class ValueBdd extends Annotation {
    
}

class TypeBdd extends Annotation {
    
}

class Primary extends Annotation {
    
}

class Param extends Annotation {
    
}

class ClassBdd {

    protected $reflectionClass;
    protected $reflectionAnnotatedClass;

    // Construction par défaut.
    public function __construct($tableau = '') {
        $this->reflectionClass = new ReflectionClass(get_class($this));
        $this->reflectionAnnotatedClass = new ReflectionAnnotatedClass(get_class($this));
        if ($tableau != '') {
            $this->setInformations($tableau);
        }
    }

    // Modifier les informations de la classes
    public function setInformations($tableau) {
        foreach ($this->reflectionClass->getProperties() as $propertie) {
            $propriete = $propertie->getName();
            $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
            $annotation = $attribut->getAnnotation('ValueBdd');
            if ($annotation != null && isset($tableau["{$annotation->value}"])) {
                $this->$propriete = $tableau["{$annotation->value}"];
            }
        }
    }

    // Récupère les informations à partir d'un id
    public function recup($id) {
        $primary = "";
        foreach ($this->reflectionClass->getProperties() as $propertie) {
            $propriete = $propertie->getName();
            $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
            $annotation = $attribut->getAnnotation('Primary');
            if ($annotation != null && $annotation->value == "primary") {
                $primary = $attribut->getAnnotation('ValueBdd')->value;
                break;
            }
        }
        $requete = DB()->prepare("SELECT * FROM " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . " WHERE " . $primary . " = :id;");
        $requete->bindParam(':id', $id);

        // Retourne le résultat
        $resultat = exec_sql($requete, true);

        // On a un résultat
        if (isset($resultat[0])) {
            // On intègre les informations dans la classe
            $this->setInformations($resultat[0]);
        }
    }

    // Sauvegarde la classe
    public function save() {

        // On vérifie si la table existe
        $reqTmp = DB()->prepare('SHOW TABLES LIKE "' . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . '"');
        $return = exec_sql($reqTmp, true);

        $first = true;

        if (count($return) == 0) {
            echo "Pas de table<br/>";

            $tmp_req = "CREATE TABLE " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . " ( ";

            foreach ($this->reflectionClass->getProperties() as $propertie) {
                $propriete = $propertie->getName();
                $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
                $annotation = $attribut->getAnnotation('Primary');
                if ($annotation == null) {
                    $value = $attribut->getAnnotation('ValueBdd');
                    $param = $attribut->getAnnotation('Param');

                    if ($value != null) {
                        if ($first) {
                            $first = false;
                        } else {
                            $tmp_req .= ", ";
                        }
                        $annotation = $attribut->getAnnotation('ValueBdd')->value;
                        $tmp_req .= $annotation . " " . $attribut->getAnnotation('TypeBdd')->value;
                    }
                } else {
                    $tmp_req .= $attribut->getAnnotation('ValueBdd')->value . " INT PRIMARY KEY NOT NULL AUTO_INCREMENT, ";
                }
            }

            $tmp_req .= " )";

            $reqTmp = DB()->prepare($tmp_req);
            exec_sql($reqTmp);
        }

        $first = true;

        if ($this->id == -1) {
            $tmp = "INSERT INTO " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . "(";

            foreach ($this->reflectionClass->getProperties() as $propertie) {
                $propriete = $propertie->getName();
                $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
                $annotation = $attribut->getAnnotation('Primary');
                if ($annotation == null) {
                    $value = $attribut->getAnnotation('ValueBdd');
                    $param = $attribut->getAnnotation('Param');

                    if ($value != null) {
                        if ($first) {
                            $first = false;
                        } else {
                            $tmp .= ", ";
                        }
                        $annotation = $attribut->getAnnotation('ValueBdd')->value;
                        $tmp .= $annotation;
                    }
                }
            }

            $tmp.= ") VALUES (";

            $first = true;
            foreach ($this->reflectionClass->getProperties() as $propertie) {
                $propriete = $propertie->getName();
                $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
                $annotation = $attribut->getAnnotation('Primary');
                if ($annotation == null) {
                    $value = $attribut->getAnnotation('ValueBdd');

                    if ($value != null) {
                        if ($first) {
                            $first = false;
                        } else {
                            $tmp .= ", ";
                        }
                        $tmp .= "'" . $this->$propriete . "'";
                    }
                }
            }

            $tmp.= ");";
        } else {
            $tmp = "UPDATE " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . " SET ";

            foreach ($this->reflectionClass->getProperties() as $propertie) {
                $propriete = $propertie->getName();
                $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
                $annotation = $attribut->getAnnotation('Primary');
                if ($annotation == null) {
                    $value = $attribut->getAnnotation('ValueBdd');
                    $param = $attribut->getAnnotation('Param');

                    if ($value != null) {
                        if ($first) {
                            $first = false;
                        } else {
                            $tmp .= ", ";
                        }

                        if ($param != null && $param->value == "int") {
                            $tmp .= $value->value . " = " . str_replace("'", "\'", str_replace("\'", "'", $this->$propriete));
                        } else {
                            $tmp .= $value->value . " = '" . str_replace("'", "\'", str_replace("\'", "'", $this->$propriete)) . "'";
                        }
                    }
                }
            }

            $primary = "";
            foreach ($this->reflectionClass->getProperties() as $propertie) {
                $propriete = $propertie->getName();
                $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
                $annotation = $attribut->getAnnotation('Primary');
                if ($annotation != null && $annotation->value == "primary") {
                    $primary = $attribut->getAnnotation('ValueBdd')->value;
                    break;
                }
            }

            $tmp .= " WHERE " . $primary . " = " . $this->$propriete . ";";
        }

        $requete = DB()->prepare($tmp);
        exec_sql($requete);

        $this->lastSave();
    }

    // Insert la classe
    public function insert() {

        $first = true;
        $tmp = "INSERT INTO " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . "(";

        foreach ($this->reflectionClass->getProperties() as $propertie) {
            $propriete = $propertie->getName();
            $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
            $annotation = $attribut->getAnnotation('Primary');
            if ($annotation == null) {
                $value = $attribut->getAnnotation('ValueBdd');
                $param = $attribut->getAnnotation('Param');

                if ($value != null) {
                    if ($first) {
                        $first = false;
                    } else {
                        $tmp .= ", ";
                    }
                    $annotation = $attribut->getAnnotation('ValueBdd')->value;
                    $tmp .= $annotation;
                }
            }
        }

        $tmp.= ") VALUES (";

        $first = true;
        foreach ($this->reflectionClass->getProperties() as $propertie) {
            $propriete = $propertie->getName();
            $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
            $annotation = $attribut->getAnnotation('Primary');
            $param = $attribut->getAnnotation('Param');
            if ($annotation == null) {
                $value = $attribut->getAnnotation('ValueBdd');

                if ($value != null) {
                    if ($first) {
                        $first = false;
                    } else {
                        $tmp .= ", ";
                    }

                    if ($param != null && $param->value == "int") {
                        $tmp .= str_replace("'", "\'", str_replace("\'", "'", $this->$propriete));
                    } else {
                        $tmp .= "'" . str_replace("'", "\'", str_replace("\'", "'", $this->$propriete)) . "'";
                    }
                }
            }
        }

        $tmp.= ") ON DUPLICATE KEY UPDATE uni_json = '".str_replace("'", "\\'", $this->data)."';";
        
        $requete = DB()->prepare($tmp);
        exec_sql($requete);
    }

    // Récupère les informations d'un Array fait avec la fonction convertArray (JS)
    public function reverseArray($tab) {
        foreach ($tab as $element) {
            $this->{$element['id']} = $element['value'];
        }
    }

    // Supprime l'instance dans la base de données
    public function delete() {

        $primary = "";
        $value = "";

        foreach ($this->reflectionClass->getProperties() as $propertie) {
            $propriete = $propertie->getName();
            $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
            $annotation = $attribut->getAnnotation('Primary');
            if ($annotation != null && $annotation->value == "primary") {
                $primary = $attribut->getAnnotation('ValueBdd')->value;
                $value = $this->{$attribut->name};
                break;
            }
        }

        // Création de la requête
        $requete = DB()->prepare("DELETE FROM " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . " WHERE " . $primary . " = :id;");
        $requete->bindParam(':id', $value);

        // Exécute la requête
        exec_sql($requete);
    }

    // Récupérer le dernier enregistrer dans la base de données
    public function lastSave() {

        $primary = "";
        $attribut_tmp = null;

        foreach ($this->reflectionClass->getProperties() as $propertie) {
            $propriete = $propertie->getName();
            $attribut = new ReflectionAnnotatedProperty(get_class($this), $propriete);
            $annotation = $attribut->getAnnotation('Primary');
            if ($annotation != null && $annotation->value == "primary") {
                $primary = $attribut->getAnnotation('ValueBdd')->value;
                $attribut_tmp = $attribut;
                break;
            }
        }

        $requete = DB()->prepare("SELECT * FROM " . $this->reflectionAnnotatedClass->getAnnotation('ValueBdd')->value . " ORDER BY " . $primary . " DESC LIMIT 1;");

        $resultat = exec_sql($requete, true);
        $this->setInformations($resultat[0]);
    }

    // Récupérer un Json de la classe
    public function getJson() {
        return @json_encode(get_object_vars($this));
    }

}
