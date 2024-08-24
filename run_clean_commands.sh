#!/bin/bash

# Définir le chemin vers le répertoire de votre projet Symfony
PROJECT_DIR="/homez.1035/calculi/devenir-independant-simulateur"

# Définir le chemin vers l'exécutable PHP
PHP_BIN="/usr/local/php8.2/bin/php"

# Exécuter les commandes Symfony avec les options nécessaires
$PHP_BIN -d memory_limit=2048M -d display_errors=on $PROJECT_DIR/bin/console app:clean-simulations
$PHP_BIN -d memory_limit=2048M -d display_errors=on $PROJECT_DIR/bin/console app:clean-anonymous-users
$PHP_BIN -d memory_limit=2048M -d display_errors=on $PROJECT_DIR/bin/console app:clean-orphaned-sessions
