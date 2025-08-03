#!/usr/bin/env python3
"""
Bombyx Population Growth Model Simulator

Simulates population growth using discrete logistic model:
xi+1 = k * xi * (1000 - xi) / 1000

Author: Ilona Emefa
"""

import sys

MAX_POPULATION = 1000
MAX_GENERATIONS = 100
K_MIN, K_MAX = 1.0, 4.0
I_MIN, I_MAX = 100, 400
EXIT_ERROR = 84

def error(message):
    """Display error message and exit."""
    print(message, file=sys.stderr)
    sys.exit(EXIT_ERROR)

def bombyx_evolution(initial_pop, growth_rate):
    """Calculate next population using discrete logistic model."""
    return growth_rate * initial_pop * (MAX_POPULATION - initial_pop) / MAX_POPULATION

def validate_growth_rate(k):
    """Validate growth rate k."""
    if not (K_MIN <= k <= K_MAX):
        error(f"Erreur : k doit être entre {K_MIN} et {K_MAX}.")

def validate_range_parameters(i0, i1):
    """Validate range parameters."""
    if i0 < I_MIN or i1 > I_MAX or i0 > i1:
        error(f"Erreur : i0 et i1 doivent être entre {I_MIN} et {I_MAX} et i0 ≤ i1.")

def calculate_growth_nk(n, k):
    """Simulate population growth for single k value."""
    validate_growth_rate(k)
    xi = n
    
    for generation in range(1, MAX_GENERATIONS + 1):
        print(f"{generation} {xi:.2f}")
        xi = bombyx_evolution(xi, k)

def calculate_growth(n, i0, i1):
    """Simulate population growth for range of k values."""
    validate_range_parameters(i0, i1)
    
    for k_int in range(i0, i1 + 1):
        k = k_int / 100.0
        xi = n
        
        for _ in range(MAX_GENERATIONS):
            xi = bombyx_evolution(xi, k)
            print(f"{k:.2f} {xi:.2f}")

def parse_arguments():
    """Parse and validate command line arguments."""
    if len(sys.argv) < 3:
        error("Usage: ./my_bombyx.py n [k | i0 i1]")

    try:
        n = float(sys.argv[1])
        if n <= 0:
            error("Erreur : la population initiale n doit être positive.")
    except ValueError:
        error("Erreur : n doit être un nombre valide.")

    return n, sys.argv[2:]

def main():
    """Main function."""
    n, args = parse_arguments()

    if len(args) == 1:
        try:
            k = float(args[0])
        except ValueError:
            error("Erreur : k doit être un nombre valide.")
        calculate_growth_nk(n, k)

    elif len(args) == 2:
        try:
            i0, i1 = int(args[0]), int(args[1])
        except ValueError:
            error("Erreur : i0 et i1 doivent être des entiers valides.")
        calculate_growth(n, i0, i1)

    else:
        error("Erreur : nombre d'arguments invalide.")

if __name__ == "__main__":
    main()
