import { API_BASE_URL } from "../config.js";

export default class APIService {
    static async fetchQuizByCode(code) {
        const response = await fetch(`${API_BASE_URL}/quizzes/code/${code}`);

        if (!response.ok) {
            let error = new Error(response.statusText);
            error.status = response.status;

            if (error.status === 404) {
                error = new Error('Code de quiz invalide');
            }

            throw error;
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
