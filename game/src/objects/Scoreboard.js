import { COLORS } from "../config.js";

export default class Scoreboard {
    constructor(scene) {
        this.scene = scene;
        const { width } = scene.scale;

        // Fond du tableau
        this.board = scene.add
            .rectangle(width / 2, 60, width - 40, 90, 0x1a1a2e)
            .setStrokeStyle(2, COLORS.primary);

        // Score
        this.scoreText = scene.add
            .text(width / 2, 38, "Score : 0 / 0", {
                fontSize: "18px",
                color: "#ffffff",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Feedback (bonne/mauvaise réponse)
        this.feedbackText = scene.add
            .text(width / 2, 80, "", {
                fontSize: "15px",
                color: "#aaaacc",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);
    }

    updateScore(correct, total) {
        this.scoreText.setText(`Score : ${correct} / ${total}`);
    }

    showFeedback(isCorrect, correctAnswer) {
        const answer = correctAnswer ? "VRAI ✅" : "FAUX ❌";
        if (isCorrect) {
            this.feedbackText.setText(
                `✅ Bonne réponse ! La réponse était : ${answer}`,
            );
            this.feedbackText.setColor("#2ecc71");
        } else {
            this.feedbackText.setText(
                `❌ Mauvaise réponse ! La réponse était : ${answer}`,
            );
            this.feedbackText.setColor("#e74c3c");
        }
    }

    clearFeedback() {
        this.feedbackText.setText("");
    }
}
