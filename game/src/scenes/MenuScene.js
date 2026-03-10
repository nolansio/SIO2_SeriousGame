import Phaser from 'phaser';
import { SCENES, COLORS } from '../config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create() {
    const { width, height } = this.scale;
    const quiz = this.registry.get('quiz');

    // --- Fond ---
    this.add.rectangle(width / 2, height / 2, width, height, COLORS.background);

    // --- Titre du jeu ---
    this.add
      .text(width / 2, 100, '🗑️ Quiz Corbeille', {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // --- Séparateur ---
    this.add.rectangle(width / 2, 145, width - 80, 2, COLORS.primary);

    // --- Titre du quiz ---
    this.add
      .text(width / 2, 200, quiz.title, {
        fontSize: '22px',
        color: '#a89cf7',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // --- Description ---
    this.add
      .text(width / 2, 250, quiz.description ?? '', {
        fontSize: '15px',
        color: '#aaaacc',
        fontFamily: 'monospace',
        wordWrap: { width: width - 120 },
        align: 'center',
      })
      .setOrigin(0.5);

    // --- Nombre de questions ---
    this.add
      .text(
        width / 2,
        320,
        `${quiz.questions.length} question${quiz.questions.length > 1 ? 's' : ''}`,
        {
          fontSize: '16px',
          color: '#ffffff',
          fontFamily: 'monospace',
        }
      )
      .setOrigin(0.5);

    // --- Bouton Jouer ---
    this._createPlayButton(width / 2, 430);

    // --- Instructions ---
    this.add
      .text(
        width / 2,
        530,
        'Lancez la boulette dans la bonne corbeille !\n✅ VRAI          ❌ FAUX',
        {
          fontSize: '14px',
          color: '#666688',
          fontFamily: 'monospace',
          align: 'center',
        }
      )
      .setOrigin(0.5);
  }

  _createPlayButton(x, y) {
    const btn = this.add
      .rectangle(x, y, 220, 55, COLORS.primary)
      .setInteractive({ useHandCursor: true });

    const label = this.add
      .text(x, y, '▶  JOUER', {
        fontSize: '22px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Hover
    btn.on('pointerover', () => btn.setFillStyle(0x9b8df8));
    btn.on('pointerout',  () => btn.setFillStyle(COLORS.primary));

    // Clic → GameScene
    btn.on('pointerdown', () => {
      this.scene.start(SCENES.GAME);
    });
  }
}
