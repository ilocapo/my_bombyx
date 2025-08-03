// Bombyx Population Model - JavaScript
// Interactive simulation and visualization

class BombyxSimulator {
    constructor() {
        this.chart = null;
        this.bifurcationChart = null;
        this.isGeneratingBifurcation = false;
        this.initializeElements();
        this.setupEventListeners();
        this.initializeChart();
        this.runInitialSimulation();
    }

    initializeElements() {
        this.elements = {
            initialPop: document.getElementById('initialPop'),
            growthRate: document.getElementById('growthRate'),
            generations: document.getElementById('generations'),
            simulateBtn: document.getElementById('simulateBtn'),
            resetBtn: document.getElementById('resetBtn'),
            bifurcationBtn: document.getElementById('bifurcationBtn'),
            bifurcationSection: document.getElementById('bifurcationSection'),
            generateBifurcation: document.getElementById('generateBifurcation'),
            kMin: document.getElementById('kMin'),
            kMax: document.getElementById('kMax'),
            progressBar: document.getElementById('progressBar'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            finalPop: document.getElementById('finalPop'),
            behavior: document.getElementById('behavior'),
            stability: document.getElementById('stability')
        };
    }

    setupEventListeners() {
        // Mise à jour des affichages des valeurs
        this.elements.initialPop.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
        });

        this.elements.growthRate.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = parseFloat(e.target.value).toFixed(2);
        });

        this.elements.generations.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
        });

        // Boutons principaux
        this.elements.simulateBtn.addEventListener('click', () => this.runSimulation());
        this.elements.resetBtn.addEventListener('click', () => this.resetSimulation());
        this.elements.bifurcationBtn.addEventListener('click', () => this.toggleBifurcationSection());
        this.elements.generateBifurcation.addEventListener('click', () => this.generateBifurcationDiagram());

        // Simulation automatique lors du changement de paramètres
        [this.elements.initialPop, this.elements.growthRate, this.elements.generations].forEach(element => {
            element.addEventListener('input', () => {
                if (!this.isGeneratingBifurcation) {
                    setTimeout(() => this.runSimulation(), 100);
                }
            });
        });
    }

    // Simulation du modèle Bombyx
    simulateBombyx(n, k, generations) {
        const population = [];
        let xi = n;
        
        for (let i = 0; i < generations; i++) {
            population.push({ x: i, y: xi });
            xi = k * xi * (1000 - xi) / 1000;
        }
        
        return population;
    }

    // Analyse du comportement de la population
    analyzeBehavior(population, k) {
        const lastValues = population.slice(-20).map(p => p.y);
        const finalValue = lastValues[lastValues.length - 1];
        const variance = this.calculateVariance(lastValues);
        
        let behavior, stability;
        
        if (k < 3.0) {
            behavior = "Convergence stable";
            stability = variance < 1 ? "Très stable" : "Stable";
        } else if (k < 3.45) {
            behavior = "Oscillations périodiques";
            stability = variance < 100 ? "Modérément stable" : "Instable";
        } else if (k < 3.57) {
            behavior = "Chaos naissant";
            stability = "Instable";
        } else {
            behavior = "Chaos développé";
            stability = "Très instable";
        }
        
        return { behavior, stability, finalValue: finalValue.toFixed(2) };
    }

    calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b) / values.length;
        return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    }

    // Initialisation du graphique
    initializeChart() {
        const ctx = document.getElementById('populationChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Population',
                    data: [],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Évolution de la Population Bombyx',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Génération',
                            font: { weight: 'bold' }
                        },
                        grid: { alpha: 0.3 }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Population',
                            font: { weight: 'bold' }
                        },
                        grid: { alpha: 0.3 }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Exécution de la simulation
    runSimulation() {
        const n = parseFloat(this.elements.initialPop.value);
        const k = parseFloat(this.elements.growthRate.value);
        const generations = parseInt(this.elements.generations.value);

        // Animation du bouton
        const originalText = this.elements.simulateBtn.innerHTML;
        this.elements.simulateBtn.innerHTML = 'Simulation...';
        this.elements.simulateBtn.disabled = true;

        setTimeout(() => {
            const population = this.simulateBombyx(n, k, generations);
            const analysis = this.analyzeBehavior(population, k);

            // Mise à jour du graphique
            this.chart.data.datasets[0].data = population;
            this.chart.options.plugins.title.text = `Évolution de la Population (n₀=${n}, k=${k})`;
            this.chart.update();

            // Mise à jour des statistiques
            this.updateStats(analysis);

            // Restauration du bouton
            this.elements.simulateBtn.innerHTML = originalText;
            this.elements.simulateBtn.disabled = false;

            // Animation des cartes
            this.animateCards();
        }, 100);
    }

    updateStats(analysis) {
        this.elements.finalPop.textContent = analysis.finalValue;
        this.elements.behavior.textContent = analysis.behavior;
        this.elements.stability.textContent = analysis.stability;
    }

    // Simulation initiale
    runInitialSimulation() {
        setTimeout(() => this.runSimulation(), 500);
    }

    // Reset de la simulation
    resetSimulation() {
        this.elements.initialPop.value = 10;
        this.elements.growthRate.value = 3.3;
        this.elements.generations.value = 100;
        
        // Mise à jour des affichages
        this.elements.initialPop.nextElementSibling.textContent = '10';
        this.elements.growthRate.nextElementSibling.textContent = '3.30';
        this.elements.generations.nextElementSibling.textContent = '100';

        this.runSimulation();
    }

    // Toggle section bifurcation
    toggleBifurcationSection() {
        const section = this.elements.bifurcationSection;
        const isVisible = section.style.display !== 'none';
        
        section.style.display = isVisible ? 'none' : 'block';
        this.elements.bifurcationBtn.innerHTML = isVisible ? 
            'Bifurcation' : 'Fermer bifurcation';

        if (!isVisible && !this.bifurcationChart) {
            this.initializeBifurcationChart();
        }
    }

    // Initialisation du graphique de bifurcation
    initializeBifurcationChart() {
        const ctx = document.getElementById('bifurcationChart').getContext('2d');
        
        this.bifurcationChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Points de bifurcation',
                    data: [],
                    backgroundColor: 'rgba(245, 158, 11, 0.6)',
                    borderColor: 'rgb(245, 158, 11)',
                    pointRadius: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Carte de Bifurcation du Modèle Bombyx',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Taux de croissance (k)',
                            font: { weight: 'bold' }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Population asymptotique',
                            font: { weight: 'bold' }
                        }
                    }
                }
            }
        });
    }

    // Génération du diagramme de bifurcation
    async generateBifurcationDiagram() {
        if (this.isGeneratingBifurcation) return;

        this.isGeneratingBifurcation = true;
        const kMin = parseFloat(this.elements.kMin.value);
        const kMax = parseFloat(this.elements.kMax.value);
        const step = 0.01;
        const n = 10;

        // Affichage de la barre de progression
        this.elements.progressBar.style.display = 'block';
        this.elements.generateBifurcation.innerHTML = 'Génération...';
        this.elements.generateBifurcation.disabled = true;

        const bifurcationData = [];
        const totalSteps = Math.ceil((kMax - kMin) / step);
        let currentStep = 0;

        // Fonction récursive pour éviter de bloquer l'interface
        const processStep = () => {
            const k = kMin + currentStep * step;
            if (k <= kMax) {
                // Simulation pour cette valeur de k
                const population = this.simulateBombyx(n, k, 200);
                
                // Prendre les 30 dernières valeurs (asymptotiques)
                const asymptotic = population.slice(-30);
                asymptotic.forEach(point => {
                    bifurcationData.push({ x: k, y: point.y });
                });

                // Mise à jour de la progression
                currentStep++;
                const progress = (currentStep / totalSteps) * 100;
                this.elements.progressFill.style.width = `${progress}%`;
                this.elements.progressText.textContent = `${Math.round(progress)}%`;

                // Continuer avec la prochaine étape
                setTimeout(processStep, 1);
            } else {
                // Terminé
                this.bifurcationChart.data.datasets[0].data = bifurcationData;
                this.bifurcationChart.update();

                // Masquer la barre de progression
                this.elements.progressBar.style.display = 'none';
                this.elements.generateBifurcation.innerHTML = 'Générer';
                this.elements.generateBifurcation.disabled = false;
                this.isGeneratingBifurcation = false;

                console.log(`Bifurcation générée avec ${bifurcationData.length} points`);
            }
        };

        // Commencer le processus
        setTimeout(processStep, 100);
    }

    // Animation des cartes
    animateCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 50);
        });
    }
}

// Utilitaires mathématiques
const MathUtils = {
    // Détection des points fixes
    findFixedPoints: (k) => {
        if (k <= 1) return [0];
        if (k <= 3) return [0, (k-1)*1000/k];
        return []; // Comportement plus complexe
    },

    // Calcul de l'exposant de Lyapunov (indicateur de chaos)
    lyapunovExponent: (population) => {
        let sum = 0;
        for (let i = 1; i < population.length; i++) {
            const derivative = Math.abs(population[i].y - population[i-1].y);
            if (derivative > 0) {
                sum += Math.log(derivative);
            }
        }
        return sum / (population.length - 1);
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bombyx Population Model - Interface Web Initialisée');
    new BombyxSimulator();
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur dans l\'application:', e.error);
});

// Export pour utilisation dans d'autres scripts
window.BombyxSimulator = BombyxSimulator;
