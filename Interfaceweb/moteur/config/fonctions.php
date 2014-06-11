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

function date_create_from_format($dformat, $dvalue) {

    $schedule = $dvalue;
    $schedule_format = str_replace(array('Y', 'm', 'd', 'H', 'i', 'a'), array('%Y', '%m', '%d', '%I', '%M', '%p'), $dformat);
// %Y, %m and %d correspond to date()'s Y m and d.
// %I corresponds to H, %M to i and %p to a
    $ugly = strptime($schedule, $schedule_format);
    $ymd = sprintf(
// This is a format string that takes six total decimal
// arguments, then left-pads them with zeros to either
// 4 or 2 characters, as needed
            '%04d-%02d-%02d %02d:%02d:%02d', $ugly['tm_year'] + 1900, // This will be "111", so we need to add 1900.
            $ugly['tm_mon'] + 1, // This will be the month minus one, so we add one.
            $ugly['tm_mday'], $ugly['tm_hour'], $ugly['tm_min'], $ugly['tm_sec']
    );
    $new_schedule = new DateTime($ymd);

    return $new_schedule;
}

function time_diff($dt1, $dt2) {
    $y1 = substr($dt1, 0, 4);
    $m1 = substr($dt1, 5, 2);
    $d1 = substr($dt1, 8, 2);
    $h1 = substr($dt1, 11, 2);
    $i1 = substr($dt1, 14, 2);
    $s1 = substr($dt1, 17, 2);

    $y2 = substr($dt2, 0, 4);
    $m2 = substr($dt2, 5, 2);
    $d2 = substr($dt2, 8, 2);
    $h2 = substr($dt2, 11, 2);
    $i2 = substr($dt2, 14, 2);
    $s2 = substr($dt2, 17, 2);

    $r1 = date('U', mktime($h1, $i1, $s1, $m1, $d1, $y1));
    $r2 = date('U', mktime($h2, $i2, $s2, $m2, $d2, $y2));
    return ($r1 - $r2);
}

function distance($point1, $point2) {
    
    $infos1 = json_decode($point1->data);
    $infos2 = json_decode($point2->data);
    
    //Conversion des latitudes/longitudes en degrés vers du radian
    $lat1Rad = deg2rad($infos1->latitude);
    $lon1Rad = deg2rad($infos1->longitude);
    $lat2Rad = deg2rad($infos2->latitude);
    $lon2Rad = deg2rad($infos2->longitude);
    
    // On calcul la distance en radian entre les 2 points GPS
    $distanceRad = 2 * asin(sqrt(pow((sin(($lat1Rad - $lat2Rad) / 2)), 2) + cos($lat1Rad) * cos($lat2Rad) * (pow(sin((($lon1Rad - $lon2Rad) / 2)), 2))));

    // On calcule cette distance en km grace au rayon de la terre
    return $distanceRad * 6366;
}
