# Bombyx Population Growth Model

## Description

Ce projet implémente et visualise le modèle de croissance logistique discret appliqué à la population du Bombyx (ver à soie). Le modèle suit l'équation :

```
x(i+1) = k × x(i) × (1000 - x(i)) / 1000
```

où `k` est le taux de croissance et `x(i)` la population à la génération i.

## Contexte

Le modèle de Bombyx illustre les comportements dynamiques des systèmes non-linéaires :
- **Convergence stable** (k < 3.0) : la population tend vers un équilibre
- **Oscillations périodiques** (3.0 < k < 3.45) : alternance entre plusieurs états
- **Chaos déterministe** (k > 3.45) : comportement imprévisible mais déterministe

Ce type de modèle est fondamental en dynamique des populations, théorie du chaos et systèmes complexes.

## Fonctionnalités

- Simulation de l'évolution de population avec paramètres ajustables
- Interface web interactive avec visualisation temps réel
- Génération de cartes de bifurcation pour analyser les transitions
- Analyse automatique du comportement (stable, périodique, chaotique)

## Utilisation

### Interface Web (Recommandé)

```bash
python3 server.py
```

L'interface s'ouvre automatiquement dans le navigateur à l'adresse `http://localhost:8000`.

### Mode Terminal

```bash
# Simulation simple
python3 my_bombyx.py 10 3.3

# Analyse de bifurcation
python3 my_bombyx.py 10 100 400

# Avec Makefile
make run        # Simulation standard
make run_range  # Analyse complète
make web        # Interface web
```

## Structure

```
my_bombyx/
├── my_bombyx.py    # Script principal de simulation
├── server.py       # Serveur web pour interface interactive
├── Makefile        # Automatisation des commandes
├── web/            # Interface web
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Technologies

- Python 3.7+
- HTML5/CSS3/JavaScript
- Chart.js pour les visualisations
- HTTP Server intégré

## Auteur

Ilona Emefa - Projet de portfolio pour candidature Bachelor 3ème année IA
# my_bombyx
