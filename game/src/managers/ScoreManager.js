export default class ScoreManager {
    constructor() {
        this.correct = 0;
        this.total = 0;
    }

    /**
     * Enregistre une réponse
     * @param {boolean} isCorrect
     */
    record(isCorrect) {
        this.total++;
        if (isCorrect) this.correct++;
    }

    /**
     * Retourne le score sous forme d'objet
     */
    getScore() {
        return {
            correct: this.correct,
            total: this.total,
            percent:
                this.total > 0
                    ? Math.round((this.correct / this.total) * 100)
                    : 0,
        };
    }

    reset() {
        this.correct = 0;
        this.total = 0;
    }
}
