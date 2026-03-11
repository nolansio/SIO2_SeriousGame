import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config.js";
import { PaperBall } from "../objects/PaperBall.js";
import { Bin } from "../objects/Bin.js";

// Layout
// Plan 3 (loin)   : mur du fond + corbeilles  → haut de l'écran
// Plan 2 (milieu) : sol en perspective         → entre FLOOR_Y et bas
// Plan 1 (proche) : joueur + boulette          → bas de l'écran
const FLOOR_Y = 490; // ligne d'horizon mur/sol
const BIN_BODY_H = 80; // hauteur corps corbeille
const BIN_OPENING_Y = FLOOR_Y - BIN_BODY_H; // Y de l'ouverture = 410

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
        this.waiting = false;

        // Catégorie de collision avec le monde
        this.worldBounds = 0x0001;
        this.ballLayer = this.matter.world.nextCategory();
        this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.matter.world.setBounds();

        this._drawBackground(width, height);

        // Barre du haut
        this.add.rectangle(width / 2, 30, width, 60, 0x0d0d1a).setDepth(10);

        this.scoreText = this.add
            .text(width - 20, 30, "Score : 0", {
                fontSize: "16px",
                color: "#a89cf7",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(1, 0.5)
            .setDepth(11);

        this.progressText = this.add
            .text(20, 30, "Question 1 / " + this.questions.length, {
                fontSize: "14px",
                color: "#aaaacc",
                fontFamily: "monospace",
            })
            .setOrigin(0, 0.5)
            .setDepth(11);

        // Carte de la question
        const cardY = 120;
        this.questionCard = this.add
            .rectangle(width / 2, cardY, width - 80, 90, 0x1e1e3a)
            .setStrokeStyle(2, COLORS.primary)
            .setDepth(10);

        this.questionText = this.add
            .text(width / 2, cardY, "", {
                fontSize: "17px",
                color: "#ffffff",
                fontFamily: "monospace",
                wordWrap: { width: width - 130 },
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(11);

        // Corbeilles posées sur le sol (plan 3)
        this.binFaux = new Bin(this, 160, BIN_OPENING_Y, FLOOR_Y, "FAUX");
        this.binVrai = new Bin(
            this,
            width - 160,
            BIN_OPENING_Y,
            FLOOR_Y,
            "VRAI",
        );

        // Feedback
        this.feedbackText = this.add
            .text(width / 2, FLOOR_Y + 60, "", {
                fontSize: "24px",
                fontFamily: "monospace",
                fontStyle: "bold",
                color: "#ffffff",
            })
            .setOrigin(0.5)
            .setAlpha(0)
            .setDepth(20);

        // Boulette (plan 1, proche du joueur)
        this.ball = new PaperBall(this, width / 2, height - 55, () => {});

        this._loadQuestion(0);
    }

    // Décors : 3 plans de profondeur
    _drawBackground(width, height) {
        // Plan 3 : mur du fond
        this.add.rectangle(width / 2, FLOOR_Y / 2, width, FLOOR_Y, 0x13131f);

        const wall = this.add.graphics().setDepth(1);
        wall.lineStyle(1, 0x1f1f30, 1);
        for (let x = 0; x <= width; x += 80)
            wall.lineBetween(x, 60, x, FLOOR_Y);
        for (let y = 60; y <= FLOOR_Y; y += 60)
            wall.lineBetween(0, y, width, y);

        // Ligne d'horizon (jonction mur / sol)
        // this.add.rectangle(width / 2, FLOOR_Y, width, 3, 0x5a5a9a).setDepth(4);

        const mainWidth = GAME_WIDTH / 1.4;
        const mainX = GAME_WIDTH / 2;
        const mainY = FLOOR_Y;
        const angleSize = 500; // L'écartement horizontal (vers l'extérieur)
        const heightSize = 500; // La longueur verticale (vers le bas)

        this.add.rectangle(mainX, mainY, mainWidth, 3, 0x5a5a9a).setDepth(4);

        // // Diago
        // this.add
        //     .line(
        //         mainX - mainWidth / 2,
        //         mainY,
        //         0,
        //         0,
        //         -angleSize,
        //         heightSize,
        //         0x5a5a9a,
        //     )
        //     .setLineWidth(3)
        //     .setOrigin(0, 0)
        //     .setDepth(4);

        // this.add
        //     .line(
        //         mainX + mainWidth / 2,
        //         mainY,
        //         0,
        //         0,
        //         angleSize,
        //         heightSize,
        //         0x5a5a9a,
        //     )
        //     .setLineWidth(3)
        //     .setOrigin(0, 0)
        //     .setDepth(4);

        // Mur
        // this.add
        //     .line(mainX - mainWidth / 2, mainY, 0, 0, 0, -heightSize, 0x5a5a9a)
        //     .setLineWidth(3)
        //     .setOrigin(0, 0)
        //     .setDepth(4);

        // this.add
        //     .line(mainX + mainWidth / 2, mainY, 0, 0, 0, -heightSize, 0x5a5a9a)
        //     .setLineWidth(3)
        //     .setOrigin(0, 0)
        //     .setDepth(4);

        const floor = this.add.graphics().setDepth(2);
        const vanishX = width / 2;

        // Lignes de fuite convergeant vers le centre de l'horizon
        for (let i = 0; i <= 10; i++) {
            const bx = (width / 10) * i;
            const alpha = 0.08 + 0.12 * Math.abs(i / 10 - 0.5) * 2;
            floor.lineStyle(1, 0x3a3a6a, alpha);
            floor.lineBetween(vanishX, FLOOR_Y, bx, height);
        }

        // Lignes horizontales du sol (s'écartent vers le bas = perspective)
        let y = FLOOR_Y + 10,
            gap = 12;
        while (y < height) {
            const alpha = Phaser.Math.Linear(
                0.05,
                0.18,
                (y - FLOOR_Y) / (height - FLOOR_Y),
            );
            floor.lineStyle(1, 0x3a3a6a, alpha);
            floor.lineBetween(0, y, width, y);
            y += gap;
            gap += 4;
        }

        // Plan 1 : vignette bas
        const vig = this.add.graphics().setDepth(3);
        for (let i = 0; i < 40; i++) {
            vig.fillStyle(0x000000, (1 - i / 40) * 0.25);
            vig.fillRect(0, height - i * 3, width, 3);
        }
    }

    // Boucle : détection collision
    update() {
        // if (!this.ball?.isFlying || this.waiting) return;
        // const bx = this.ball.circle.x;
        // const by = this.ball.circle.y;
        // const vy = this.ball._vy;
        // const { width, height } = this.scale;
        // // Balle descend (vy > 0) et franchit le Y de l'ouverture par le haut → vérifier
        // if (vy > 0 && by >= BIN_OPENING_Y && !this.ball._checkedBin) {
        //     this.ball._checkedBin = true;
        //     if (this.binVrai.contains(bx) || this.binFaux.contains(bx)) {
        //         this.ball.isFlying = false;
        //         this._onScore(bx);
        //         return;
        //     }
        //     // Raté → la balle continue librement (sort par le haut ou retombe)
        // }
        // // Sortie d'écran → raté
        // if (by > height + 80 || bx < -80 || bx > width + 80 || by < -80) {
        //     this.ball.isFlying = false;
        //     this._onMiss();
        // }
    }

    _onScore(bx) {
        if (this.waiting) return;
        this.waiting = true;

        const hitVrai = this.binVrai.contains(bx);
        const bin = hitVrai ? this.binVrai : this.binFaux;
        const chosenType = hitVrai ? "VRAI" : "FAUX";
        const correctAnswer = this.questions[this.currentIndex].answer;
        const isCorrect =
            (chosenType === "VRAI" && correctAnswer === true) ||
            (chosenType === "FAUX" && correctAnswer === false);

        // bin.swallowBall(this.ball.circle);
        bin.highlight(isCorrect);
        if (isCorrect) this.score++;
        this._updateScore();
        this._showFeedback(isCorrect);
        this.time.delayedCall(3000, () => this._nextQuestion());
    }

    _onMiss() {
        this.time.delayedCall(600, () => {
            if (!this.waiting) this.ball.reset();
        });
    }

    _loadQuestion(index) {
        const q = this.questions[index];
        const total = this.questions.length;
        const { width } = this.scale;

        this.questionText.setText(q.title);
        this.progressText.setText(`Question ${index + 1} / ${total}`);
        this.feedbackText.setAlpha(0);
        this.waiting = false;

        if (index > 0) {
            this.binFaux.moveTo(160 + Phaser.Math.Between(-40, 40));
            this.binVrai.moveTo(width - 160 + Phaser.Math.Between(-40, 40));
        }

        this.ball.reset();
    }

    _showFeedback(isCorrect) {
        this.feedbackText
            .setText(
                isCorrect ? "✅  Bonne réponse !" : "❌  Mauvaise réponse !",
            )
            .setColor(isCorrect ? "#2ecc71" : "#e74c3c")
            .setAlpha(1);
        this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            delay: 2000,
            duration: 800,
        });
    }

    _updateScore() {
        this.scoreText.setText(`Score : ${this.score}`);
    }

    _nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex >= this.questions.length) {
            this.scene.start(SCENES.RESULT, {
                score: this.score,
                total: this.questions.length,
            });
        } else {
            this._loadQuestion(this.currentIndex);
        }
    }
}
