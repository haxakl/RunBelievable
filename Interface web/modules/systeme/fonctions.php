<?php

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
