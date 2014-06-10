<?php

// Autoload
function __autoload($name) {
    global $_RISKAT;

    $lien = searchFile("../moteur/", strtolower($name) . ".php");

    if ($lien != null) {
        include_once $lien;
    }
}

// =================
// Fichier
// =================
// Cherche un fichier
function searchFile($dossier, $nom) {
    static $lien_file = "";

    if (is_dir($dossier)) {
        $dh = opendir($dossier);
        if ($dh) {
            while (($file = readdir($dh)) !== false) {
                if ($file != "." && $file != ".." && filetype($dossier . $file) === "dir")
                    searchFile($dossier . $file . "/", $nom);
                else {
                    if ($nom == $file) {
                        $lien_file = $dossier . $file;
                    }
                }
            }
            closedir($dh);
        }
    }

    return $lien_file;
}

// =================
// Sécurité & Debug
// =================
// Affiche une variable
function debugPrint($variable) {
    echo "<pre>";
    print_r($variable);
    echo "</pre>";
}

// Chaîne sécurisé
function secuStr($var) {
    if (isset($var) && is_string($var)) {
        return htmlspecialchars($var);
    }
    
    return $tmp;
}

// Entier sécurisé
function secuInt($var) {
    if (isset($var) && is_int($var)) {
        return $var;
    }
}

// =================
// Sql
// =================
// Execute un fichier Sql
function exec_sql($requete, $return = false) {

    // Variables
    $arrAll = null;

    // Vérifie que la requête est un objet PDO
    if ($requete instanceof PDOStatement) {

        // On teste si la requête est correct
        if ($requete->execute()) {

            // On teste maintenant si la requête attend des résultats
            if ($return) {

                // On retourne les résultats
                $arrAll = $requete->fetchAll();

                // Ferme la requête
                $requete->closeCursor();

                // On retourne le tableau
                return $arrAll;
            }

            // Sinon on renvoit vrai
            return true;
        }

        // La requête n'est pas correct
        return false;
    }
}
