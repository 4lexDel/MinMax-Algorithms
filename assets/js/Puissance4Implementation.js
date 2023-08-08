class Puissance4Implementation {
    constructor() {}


    // Fonction d'évaluation de l'état
    evaluateState(grid) {
        const hauteur = grid.length;
        const largeur = grid[0].length;

        // Configuration des points à attribuer en fonction du nombre de jetons alignés
        const points = [0, 1, 10, 100, 2000];

        // Fonction auxiliaire pour vérifier si une séquence contient uniquement des jetons d'un joueur
        function sequenceGagnante(sequence, joueur) {
            return sequence.every((jeton) => jeton === joueur);
        }

        let score = 0;

        // Vérification des lignes
        for (let i = 0; i < hauteur; i++) {
            for (let j = 0; j <= largeur - 4; j++) {
                const sequence = grid[i].slice(j, j + 4);
                if (sequenceGagnante(sequence, 1)) {
                    score += points[sequence.filter((jeton) => jeton === 1).length];
                } else if (sequenceGagnante(sequence, 2)) {
                    score -= points[sequence.filter((jeton) => jeton === 2).length];
                }
            }
        }

        // Vérification des colonnes
        for (let j = 0; j < largeur; j++) {
            for (let i = 0; i <= hauteur - 4; i++) {
                const sequence = [grid[i][j], grid[i + 1][j], grid[i + 2][j], grid[i + 3][j]];
                if (sequenceGagnante(sequence, 1)) {
                    score += points[sequence.filter((jeton) => jeton === 1).length];
                } else if (sequenceGagnante(sequence, 2)) {
                    score -= points[sequence.filter((jeton) => jeton === 2).length];
                }
            }
        }

        // Vérification des diagonales (ascendantes)
        for (let i = 3; i < hauteur; i++) {
            for (let j = 0; j <= largeur - 4; j++) {
                const sequence = [grid[i][j], grid[i - 1][j + 1], grid[i - 2][j + 2], grid[i - 3][j + 3]];
                if (sequenceGagnante(sequence, 1)) {
                    score += points[sequence.filter((jeton) => jeton === 1).length];
                } else if (sequenceGagnante(sequence, 2)) {
                    score -= points[sequence.filter((jeton) => jeton === 2).length];
                }
            }
        }

        // Vérification des diagonales (descendantes)
        for (let i = 0; i <= hauteur - 4; i++) {
            for (let j = 0; j <= largeur - 4; j++) {
                const sequence = [grid[i][j], grid[i + 1][j + 1], grid[i + 2][j + 2], grid[i + 3][j + 3]];
                if (sequenceGagnante(sequence, 1)) {
                    score += points[sequence.filter((jeton) => jeton === 1).length];
                } else if (sequenceGagnante(sequence, 2)) {
                    score -= points[sequence.filter((jeton) => jeton === 2).length];
                }
            }
        }

        return score;
    }

    // Fonction pour générer les états enfants à partir d'un état donné
    generateChildren(grille, maximizingPlayer) {
        let playerID = maximizingPlayer ? 1 : 2;
        const coupsPossibles = [];
        const hauteur = grille.length;
        const largeur = grille[0].length;

        // Vérifie si la colonne est valide pour insérer un jeton
        function estColonneValide(colonne) {
            return colonne >= 0 && colonne < largeur && grille[0][colonne] === 0;
        }

        // Copie la grille pour éviter les effets de bord lors des modifications
        function copierGrille(grille) {
            return grille.map((ligne) => [...ligne]);
        }

        for (let colonne = 0; colonne < largeur; colonne++) {
            if (estColonneValide(colonne)) {
                // Trouver la ligne vide où insérer le jeton
                let ligne = hauteur - 1;
                while (ligne >= 0 && grille[ligne][colonne] != 0) {
                    ligne--;
                }
                // console.log("LIGNE VAL TEST : " + ligne);

                if (ligne >= 0) {
                    // Effectuer le coup en copiant la grille et en insérant le jeton
                    const nouvelleGrille = copierGrille(grille);
                    nouvelleGrille[ligne][colonne] = playerID; // Vous pouvez utiliser 2 pour le joueur 2 si nécessaire

                    coupsPossibles.push(nouvelleGrille);
                }
            }
        }

        return coupsPossibles;
    }

    isGameOver(grid) {
        if (this.isGridFull(grid) || this.checkWinner(grid) != 0) return true;

        return false;
    }

    checkWinner(grid) {
        const hauteur = grid.length;
        const largeur = grid[0].length;

        // Vérification horizontale
        for (let row = 0; row < hauteur; row++) {
            for (let col = 0; col <= largeur - 4; col++) {
                const player = grid[row][col];
                if (player !== 0 &&
                    grid[row][col + 1] === player &&
                    grid[row][col + 2] === player &&
                    grid[row][col + 3] === player) {
                    return player; // On a trouvé un gagnant, on retourne le numéro du joueur
                }
            }
        }

        // Vérification verticale
        for (let row = 0; row <= hauteur - 4; row++) {
            for (let col = 0; col < largeur; col++) {
                const player = grid[row][col];
                if (player !== 0 &&
                    grid[row + 1][col] === player &&
                    grid[row + 2][col] === player &&
                    grid[row + 3][col] === player) {
                    return player; // On a trouvé un gagnant, on retourne le numéro du joueur
                }
            }
        }

        // Vérification diagonale (ascendante: /)
        for (let row = 3; row < hauteur; row++) {
            for (let col = 0; col <= largeur - 4; col++) {
                const player = grid[row][col];
                if (player !== 0 &&
                    grid[row - 1][col + 1] === player &&
                    grid[row - 2][col + 2] === player &&
                    grid[row - 3][col + 3] === player) {
                    return player; // On a trouvé un gagnant, on retourne le numéro du joueur
                }
            }
        }

        // Vérification diagonale (descendante: \)
        for (let row = 0; row <= hauteur - 4; row++) {
            for (let col = 0; col <= largeur - 4; col++) {
                const player = grid[row][col];
                if (player !== 0 &&
                    grid[row + 1][col + 1] === player &&
                    grid[row + 2][col + 2] === player &&
                    grid[row + 3][col + 3] === player) {
                    return player; // On a trouvé un gagnant, on retourne le numéro du joueur
                }
            }
        }

        return 0; // Aucun gagnant trouvé
    }

    isGridFull(grille) {
        const hauteur = grille.length;
        const largeur = grille[0].length;

        // Vérifie s'il y a des cases vides dans la grille
        for (let i = 0; i < hauteur; i++) {
            for (let j = 0; j < largeur; j++) {
                if (grille[i][j] === 0) {
                    return false; // La partie n'est pas terminée s'il y a une case vide
                }
            }
        }

        return true; // La partie est terminée, toutes les cases sont remplies
    }

}