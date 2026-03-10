import { API_BASE_URL } from "../config.js";

export default class APIService {
    /**
     * Récupère un quiz par son id (paramètre URL ?id=...)
     * Retourne : { id, title, description, questions: [{ id, enonce, reponse }] }
     */
    static async fetchQuizByCode(code) {
        const response = await fetch(`${API_BASE_URL}/quizzes/code/${code}`);

        if (!response.ok) {
            throw new Error(
                `Erreur API : ${response.status} ${response.statusText}`,
            );
        }

        const quiz = await response.json();

        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            throw new Error(
                `Quiz introuvable ou sans questions (code: ${code})`,
            );
        }

        return quiz;
    }
}
