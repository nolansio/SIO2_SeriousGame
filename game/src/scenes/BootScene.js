import Phaser from "phaser";
import { SCENES } from "../config.js";
import ApiService from "../services/ApiService.js";

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

        this.loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, "⏳ Chargement du quiz...", {
            fontSize: "20px",
            color: "#ffffff",
            fontFamily: "monospace",
        }).setOrigin(0.5);

        this.inputButton = document.createElement('input');
        this.messageInput = document.createElement('p');

        this._setupInput();

        this._loadQuiz();
    }

    _setupInput() {
        this.inputButton.type = 'text';
        this.inputButton.placeholder = 'COLD-WAR-2026';
        this.inputButton.style.position = 'absolute';
        this.inputButton.style.left = '50%';
        this.inputButton.style.top = `${this.scale.height / 2}px`;
        this.inputButton.style.transform = 'translate(-50%, -50%)';
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

        this.messageInput.style.position = 'absolute';
        this.messageInput.style.whiteSpace = 'nowrap';

        this.messageInput.style.left = '50%';
        this.messageInput.style.top = `${this.scale.height / 2 + 25}px`;
        this.messageInput.style.transform = 'translateX(-50%)';

        this.messageInput.style.fontSize = '18px';
        this.messageInput.style.fontFamily = 'monospace';
        this.messageInput.style.textAlign = 'center';
        this.messageInput.style.margin = '0';
        this.messageInput.style.padding = '10px';

        this.messageInput.style.userSelect = 'none';
        this.messageInput.style.pointerEvents = 'none';

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
            const quiz = await ApiService.fetchQuizByCode(code);
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
        document.body.appendChild(this.messageInput);

        this.inputButton.focus();
    }

    _hideInput() {
        if (this.inputButton.parentNode) {
            document.body.removeChild(this.inputButton);
        }

        if (this.messageInput.parentNode) {
            document.body.removeChild(this.messageInput);
        }
    }

    async _loadQuizWithCode(code) {
        this._showMessage("⏳ Chargement du quiz...");

        try {
            const quiz = await ApiService.fetchQuizByCode(code);
            this._hideInput();

            this.registry.set("quiz", quiz);

            history.pushState(null, '', `?code=${code}`);
            this.scene.start(SCENES.MENU);
        } catch (err) {
            this._showMessage(err.message, true);
            this.inputButton.value = '';

            this.inputButton.focus();
        }
    }

    _showMessage(content, isError = false) {
        let color = '#ffffff';

        if (isError) {
            content = `❌ ${content}`;
            color = '#e74c3c';
        }

        this.messageInput.textContent = content;
        this.messageInput.style.color = color;
    }
}