import Phaser from "phaser";
import { SCENES } from "../config.js";
import APIService from "../services/APIService.js";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENES.BOOT });
    }

    create() {
        this.add.text(this.scale.width / 2, 100, "PaperQuiz", {
            fontFamily: 'monospace',
            fontSize: 60,
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const { width, height } = this.scale;

        this.loadingText = this.add
            .text(width / 2, height / 2, "⏳ Chargement du quiz...", {
                fontSize: "20px",
                color: "#ffffff",
                fontFamily: "monospace",
            })
            .setOrigin(0.5);

        this.inputButton = document.createElement('input');
        this._setupInput();

        this._loadQuiz();
    }

    _setupInput() {
        this.inputButton.type = 'text';
        this.inputButton.placeholder = 'Code du quiz';
        this.inputButton.style.position = 'absolute';
        this.inputButton.style.top = `${this.loadingText.y + this.loadingText.height - 60}px`;
        this.inputButton.style.width = '220px';
        this.inputButton.style.height = '55px';
        this.inputButton.style.fontSize = '22px';
        this.inputButton.style.fontFamily = 'monospace';
        this.inputButton.style.fontWeight = 'bold';
        this.inputButton.style.backgroundColor = '#7c6af7';
        this.inputButton.style.color = '#ffffff';
        this.inputButton.style.border = 'none';
        this.inputButton.style.borderRadius = '10px';
        this.inputButton.style.textAlign = 'center';
        this.inputButton.style.outline = 'none';
        this.inputButton.style.cursor = 'text';

        this.inputButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const code = this.inputButton.value.trim();

                if (code) {
                    this._loadQuizWithCode(code);
                }
            }
        });
    }

    async _loadQuiz() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            this._showInput();
            return;
        }

        try {
            const quiz = await APIService.fetchQuizByCode(code);
            this.registry.set("quiz", quiz);

            this.scene.start(SCENES.PRELOADER);
        } catch (err) {
            this._showMessage(err.message, true);

            history.pushState(null, '', window.location.pathname);

            this.loadingText.setText('');
            this._showInput();
        }
    }

    _showInput() {
        this.loadingText.setText('');
        document.body.appendChild(this.inputButton);

        this.inputButton.focus();
    }

    _hideInput() {
        if (this.inputButton.parentNode) {
            document.body.removeChild(this.inputButton);
        }
    }

    async _loadQuizWithCode(code) {
        this._showMessage("⏳ Chargement du quiz...");

        try {
            const quiz = await APIService.fetchQuizByCode(code);
            this._hideInput();

            this.registry.set("quiz", quiz);

            history.pushState(null, '', `?code=${code}`);
            this.scene.start(SCENES.MENU);
        } catch (err) {
            this._showMessage(err.message, true);
            this.inputButton.value = '';

            this._showInput();
        }
    }

    _showMessage(content, isError = false) {
        if (this.messageText) {
            this.messageText.destroy();
        }

        let color = '#ffffff';

        if (isError) {
            color = '#e74c3c';
            content = `❌ ${content}`;
        }

        const x = this.scale.width / 2;
        const y = this.loadingText.y + this.loadingText.height + 35;

        this.messageText = this.add.text(x, y, content, {
            fontSize: '18px',
            color: color,
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
    }
}
