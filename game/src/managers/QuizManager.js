export default class QuizManager {
    /**
     * @param {Object} quiz - le quiz complet depuis le registry
     */
    constructor(quiz) {
        this.quiz = quiz;
        this.questions = quiz.questions;
        this.index = 0;
    }

    /**
     * Retourne la question courante
     */
    currentQuestion() {
        return this.questions[this.index];
    }

    /**
     * Retourne le numéro de la question courante (commence à 1)
     */
    currentIndex() {
        return this.index + 1;
    }

    /**
     * Nombre total de questions
     */
    total() {
        return this.questions.length;
    }

    /**
     * Vérifie si la réponse donnée est correcte
     * @param {boolean} answer - true = VRAI, false = FAUX
     */
    answer(answer) {
        return answer === this.currentQuestion().reponse;
    }

    /**
     * Passe à la question suivante
     */
    next() {
        this.index++;
    }

    /**
     * Vérifie s'il reste des questions
     */
    hasNext() {
        return this.index < this.questions.length - 1;
    }

    /**
     * Vérifie si le quiz est terminé
     */
    isFinished() {
        return this.index >= this.questions.length;
    }
}
