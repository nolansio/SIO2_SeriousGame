import Phaser from "phaser";
import { SCENES, COLORS } from "../config.js";

export default class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.RESULT });
    }

    init(data) {
        this.score = data.score ?? 0;
        this.total = data.total ?? 0;
        this.quizTitle = data.quizTitle ?? "Quiz";
    }

    create() {
        const { width, height } = this.scale;

        // ── Fond ──────────────────────────────────────────────────────────────
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            COLORS.background,
        );

        // ── Titre ─────────────────────────────────────────────────────────────
        this.add
            .text(width / 2, 80, "🏁 Quiz terminé !", {
                fontSize: "30px",
                color: "#ffffff",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, 130, this.quizTitle, {
                fontSize: "16px",
                color: "#a89cf7",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        // ── Séparateur ────────────────────────────────────────────────────────
        this.add.rectangle(width / 2, 160, width - 80, 2, COLORS.primary);

        // ── Score ─────────────────────────────────────────────────────────────
        const percent = Math.round((this.score / this.total) * 100);
        const emoji = percent >= 80 ? "⭐" : percent >= 50 ? "👍" : "💪";

        this.add
            .text(width / 2, 250, `${emoji}  ${this.score} / ${this.total}`, {
                fontSize: "48px",
                color: "#ffffff",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, 320, `${percent}% de bonnes réponses`, {
                fontSize: "18px",
                color:
                    percent >= 80
                        ? "#2ecc71"
                        : percent >= 50
                          ? "#f1c40f"
                          : "#e74c3c",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        // ── Message encouragement ─────────────────────────────────────────────
        const message =
            percent === 100
                ? "Parfait ! 🎉"
                : percent >= 80
                  ? "Excellent travail !"
                  : percent >= 50
                    ? "Pas mal, continue !"
                    : "Retente ta chance !";

        this.add
            .text(width / 2, 375, message, {
                fontSize: "16px",
                color: "#aaaacc",
                fontFamily: "monospace",
                fontStyle: "italic",
            })
            .setOrigin(0.5);

        // ── Bouton Rejouer ────────────────────────────────────────────────────
        this._createButton(width / 2, 470, "🔄  Rejouer", () => {
            this.scene.start(SCENES.MENU);
        });
    }

    _createButton(x, y, label, onClick) {
        const btn = this.add
            .rectangle(x, y, 220, 52, COLORS.primary)
            .setInteractive({ useHandCursor: true });

        this.add
            .text(x, y, label, {
                fontSize: "20px",
                color: "#ffffff",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        btn.on("pointerover", () => btn.setFillStyle(0x9b8df8));
        btn.on("pointerout", () => btn.setFillStyle(COLORS.primary));
        btn.on("pointerdown", onClick);
    }
}
