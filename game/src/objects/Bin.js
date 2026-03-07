import { COLORS } from "../config.js";

export default class Bin {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {'VRAI'|'FAUX'} type
     */
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.baseX = x;
        this.baseY = y;

        const color = type === "VRAI" ? COLORS.true : COLORS.false;

        this.body = scene.add
            .rectangle(x, y, 90, 80, color, 0.85)
            .setStrokeStyle(3, 0xffffff);

        this.label = scene.add
            .text(x, y, type, {
                fontSize: "16px",
                color: "#ffffff",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(0.5);
        // Pas d'oscillation pendant la question
    }

    /**
     * Déplace légèrement la corbeille vers une nouvelle position X
     * Appelé par GameScene entre chaque question
     */
    moveTo(newX) {
        this.baseX = newX;

        this.scene.tweens.killTweensOf(this.body);
        this.scene.tweens.killTweensOf(this.label);

        this.scene.tweens.add({
            targets: [this.body, this.label],
            x: newX,
            duration: 400,
            ease: "Sine.easeInOut",
        });
    }

    /**
     * Vérifie si le point (x, y) est dans la zone de la corbeille
     */
    contains(x, y) {
        const bx = this.body.x;
        const by = this.body.y;
        return x >= bx - 50 && x <= bx + 50 && y >= by - 45 && y <= by + 45;
    }

    /**
     * Animation flash quand une boulette entre dans la corbeille
     */
    highlight(success) {
        const color = success ? 0xffffff : 0x888888;
        this.scene.tweens.add({
            targets: this.body,
            fillColor: color,
            duration: 150,
            yoyo: true,
        });
    }
}
