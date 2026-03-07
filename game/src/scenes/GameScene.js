import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config.js";
import PaperBall from "../objects/PaperBall.js";
import Bin from "../objects/Bin.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.GAME });
    }

    create() {
        const { width, height } = this.scale;

        this.quiz = this.registry.get("quiz");
        this.questions = this.quiz.questions;
        this.currentIndex = 0;
        this.score = 0;
        this.waiting = false; // empêche de relancer pendant le délai

        // ── Fond ──────────────────────────────────────────────────────────────
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            COLORS.background,
        );

        // ── Barre du haut (score + progression) ───────────────────────────────
        this.add.rectangle(width / 2, 30, width, 60, 0x1a1a2e);

        this.scoreText = this.add
            .text(width - 20, 30, "Score : 0", {
                fontSize: "16px",
                color: "#a89cf7",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(1, 0.5);

        this.progressText = this.add
            .text(20, 30, "Question 1 / " + this.questions.length, {
                fontSize: "14px",
                color: "#aaaacc",
                fontFamily: "monospace",
            })
            .setOrigin(0, 0.5);

        // ── Carte de la question ───────────────────────────────────────────────
        const cardY = 200;
        this.questionCard = this.add
            .rectangle(width / 2, cardY, width - 80, 160, 0x1e1e3a)
            .setStrokeStyle(2, COLORS.primary);

        this.questionText = this.add
            .text(width / 2, cardY, "", {
                fontSize: "18px",
                color: "#ffffff",
                fontFamily: "monospace",
                wordWrap: { width: width - 130 },
                align: "center",
            })
            .setOrigin(0.5);

        // ── Corbeilles ────────────────────────────────────────────────────────
        const binY = 430;
        this.binFaux = new Bin(this, 160, binY, "FAUX");
        this.binVrai = new Bin(this, width - 160, binY, "VRAI");

        // ── Message feedback (Bonne / Mauvaise réponse) ───────────────────────
        this.feedbackText = this.add
            .text(width / 2, 320, "", {
                fontSize: "24px",
                fontFamily: "monospace",
                fontStyle: "bold",
                color: "#ffffff",
            })
            .setOrigin(0.5)
            .setAlpha(0);

        // ── Boulette ──────────────────────────────────────────────────────────
        this.ball = new PaperBall(this, width / 2, height - 60, (tx, ty) => {
            this._onThrow(tx, ty);
        });

        // ── Charger la première question ───────────────────────────────────────
        this._loadQuestion(0);
    }

    // ── Charger une question ───────────────────────────────────────────────────
    _loadQuestion(index) {
        const q = this.questions[index];
        const total = this.questions.length;
        const { width } = this.scale;

        this.questionText.setText(q.title);
        this.progressText.setText(`Question ${index + 1} / ${total}`);
        this.feedbackText.setAlpha(0);
        this.waiting = false;

        // Déplace légèrement les corbeilles entre chaque question (pas la première)
        if (index > 0) {
            const offsetFaux = Phaser.Math.Between(-40, 40);
            const offsetVrai = Phaser.Math.Between(-40, 40);
            this.binFaux.moveTo(160 + offsetFaux);
            this.binVrai.moveTo(width - 160 + offsetVrai);
        }

        // Réinitialise la boulette à sa position de départ
        this.ball.reset();
    }

    // ── Callback de lancer ────────────────────────────────────────────────────
    _onThrow(targetX, targetY) {
        if (this.waiting) return;

        const hitVrai = this.binVrai.contains(targetX, targetY);
        const hitFaux = this.binFaux.contains(targetX, targetY);

        if (!hitVrai && !hitFaux) {
            // Lancer raté : aucune corbeille touchée → reset
            this.time.delayedCall(500, () => {
                if (!this.waiting) this.ball.reset();
            });
            return;
        }

        this.waiting = true;

        const chosenType = hitVrai ? "VRAI" : "FAUX";
        const correctAnswer = this.questions[this.currentIndex].answer; // booléen
        const isCorrect =
            (chosenType === "VRAI" && correctAnswer === true) ||
            (chosenType === "FAUX" && correctAnswer === false);

        // Animation corbeille touchée
        const bin = hitVrai ? this.binVrai : this.binFaux;
        bin.highlight(isCorrect);

        // Score
        if (isCorrect) this.score++;
        this._updateScore();

        // Feedback
        this._showFeedback(isCorrect);

        // Timer → question suivante
        this.time.delayedCall(3000, () => {
            this._nextQuestion();
        });
    }

    // ── Affiche le feedback animé ─────────────────────────────────────────────
    _showFeedback(isCorrect) {
        const { width } = this.scale;

        this.feedbackText
            .setText(
                isCorrect ? "✅  Bonne réponse !" : "❌  Mauvaise réponse !",
            )
            .setColor(isCorrect ? "#2ecc71" : "#e74c3c")
            .setAlpha(0)
            .setX(width / 2);

        this.tweens.add({
            targets: this.feedbackText,
            alpha: { from: 0, to: 1 },
            y: { from: 330, to: 310 },
            duration: 300,
            ease: "Quad.easeOut",
        });
    }

    // ── Met à jour le texte du score ──────────────────────────────────────────
    _updateScore() {
        this.scoreText.setText(`Score : ${this.score}`);
    }

    // ── Passe à la question suivante ou fin de partie ─────────────────────────
    _nextQuestion() {
        this.currentIndex++;

        if (this.currentIndex >= this.questions.length) {
            // Fin du quiz
            this.scene.start(SCENES.RESULT, {
                score: this.score,
                total: this.questions.length,
                quizTitle: this.quiz.title,
            });
        } else {
            this._loadQuestion(this.currentIndex);
        }
    }
}
