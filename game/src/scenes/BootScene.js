import Phaser from "phaser";
import { SCENES } from "../config.js";
import APIService from "../services/APIService.js";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.BOOT });
    }

    create() {
        const { width, height } = this.scale;

        this.loadingText = this.add
            .text(width / 2, height / 2, "⏳ Chargement du quiz...", {
                fontSize: "20px",
                color: "#aaaacc",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        this._loadQuiz();
    }

    async _loadQuiz() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            this._showError(
                'Aucun paramètre "code" dans l\'URL.\nEx: ?code=AB12CD',
            );
            return;
        }

        try {
            const quiz = await APIService.fetchQuizByCode(code);
            this.registry.set("quiz", quiz);
            this.scene.start(SCENES.MENU);
        } catch (err) {
            this._showError(`❌ ${err.message}`);
        }
    }

    _showError(message) {
        this.loadingText.setText(message);
        this.loadingText.setColor("#e74c3c");
    }
}
