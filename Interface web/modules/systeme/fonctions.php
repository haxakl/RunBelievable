<?php

// Chaîne sécurisé
function securedString($var) {
    if (isset($var) && is_string($var)) {
        return htmlspecialchars($var);
    }
    
    return $tmp;
}

// Entier sécurisé
function securedInt($var) {
    if (isset($var) && is_int($var)) {
        return $var;
    }
}
