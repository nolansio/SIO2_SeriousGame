import { COLORS } from "../config.js";

export default class PaperBall {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x - position de départ X
     * @param {number} y - position de départ Y
     * @param {function} onThrow - callback(targetX, targetY) appelé au lancer
     */
    constructor(scene, x, y, onThrow) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        this.onThrow = onThrow;
        this.isDragging = false;
        this.isFlying = false;

        // Boulette (cercle blanc froissé = cercle pour le prototype)
        this.circle = scene.add
            .circle(x, y, 22, COLORS.paper)
            .setStrokeStyle(2, 0xccccaa)
            .setInteractive({ useHandCursor: true });

        // Ligne de visée
        this.aimLine = scene.add.graphics();

        this._setupInput();
    }

    _setupInput() {
        const { scene } = this;

        scene.input.on("pointerdown", (ptr) => {
            // Vérifie que le clic est sur la boulette
            const dist = Phaser.Math.Distance.Between(
                ptr.x,
                ptr.y,
                this.circle.x,
                this.circle.y,
            );
            if (dist <= 26 && !this.isFlying) {
                this.isDragging = true;
            }
        });

        scene.input.on("pointermove", (ptr) => {
            if (!this.isDragging) return;
            this._drawAimLine(ptr.x, ptr.y);
        });

        scene.input.on("pointerup", (ptr) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.aimLine.clear();

            const dist = Phaser.Math.Distance.Between(
                ptr.x,
                ptr.y,
                this.startX,
                this.startY,
            );
            // Ignore si le joueur n'a pas assez bougé
            if (dist < 20) return;

            this._throw(ptr.x, ptr.y);
        });
    }

    _drawAimLine(toX, toY) {
        this.aimLine.clear();
        this.aimLine.lineStyle(2, 0xffffff, 0.35);
        this.aimLine.beginPath();
        this.aimLine.moveTo(this.startX, this.startY);
        this.aimLine.lineTo(toX, toY);
        this.aimLine.strokePath();
    }

    _throw(targetX, targetY) {
        this.isFlying = true;

        // Animation parabolique : x linéaire, y avec arc
        const duration = 420;
        const arcHeight = -120; // monte avant d'arriver

        this.scene.tweens.add({
            targets: this.circle,
            x: targetX,
            duration,
            ease: "Linear",
        });

        this.scene.tweens.add({
            targets: this.circle,
            y: [
                {
                    value: this.startY + arcHeight,
                    duration: duration * 0.45,
                    ease: "Quad.easeOut",
                },
                {
                    value: targetY,
                    duration: duration * 0.55,
                    ease: "Quad.easeIn",
                },
            ],
            onComplete: () => {
                this.onThrow(targetX, targetY);
            },
        });
    }

    reset() {
        this.isFlying = false;
        this.isDragging = false;
        this.aimLine.clear();

        this.scene.tweens.add({
            targets: this.circle,
            x: this.startX,
            y: this.startY,
            duration: 300,
            ease: "Back.easeOut",
        });
    }

    destroy() {
        this.aimLine.destroy();
        this.circle.destroy();
    }
}
