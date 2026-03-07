import { COLORS } from "../config.js";

export default class PaperBall {
    constructor(scene, x, y, onThrow) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        this.onThrow = onThrow;
        this.isDragging = false;
        this.isFlying = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        // Historique pour la vélocité : { x, y, t }
        this._history = [];

        this.circle = scene.add
            .circle(x, y, 22, COLORS.paper)
            .setStrokeStyle(2, 0xccccaa)
            .setDepth(10);

        this.aimLine = scene.add.graphics().setDepth(9);
        this._setupInput();
    }

    _setupInput() {
        const { scene } = this;

        scene.input.on("pointerdown", (ptr) => {
            if (this.isFlying) return;
            const dist = Phaser.Math.Distance.Between(
                ptr.x,
                ptr.y,
                this.circle.x,
                this.circle.y,
            );
            if (dist <= 34) {
                this.isDragging = true;
                this.dragStartX = ptr.x;
                this.dragStartY = ptr.y;
                this._history = [{ x: ptr.x, y: ptr.y, t: performance.now() }];
            }
        });

        scene.input.on("pointermove", (ptr) => {
            if (!this.isDragging) return;
            this.circle.setPosition(ptr.x, ptr.y);
            this._drawAimLine(ptr.x, ptr.y);
            // Stocke les 6 derniers points
            this._history.push({ x: ptr.x, y: ptr.y, t: performance.now() });
            if (this._history.length > 6) this._history.shift();
        });

        scene.input.on("pointerup", (ptr) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.aimLine.clear();

            const dx = ptr.x - this.dragStartX;
            const dy = ptr.y - this.dragStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 20) {
                this.reset();
                return;
            }

            // Direction normalisée
            const nx = dx / dist;
            const ny = dy / dist;

            // Vélocité en px/ms sur les 3 derniers points
            const speed = this._getSpeed(ptr);

            // Portée : min 150px, max 500px selon vitesse
            // speed est en px/ms, une vitesse typique de swipe = 0.5 à 2 px/ms
            const range = Phaser.Math.Clamp(speed * 200, 150, 500);

            const fromX = this.circle.x;
            const fromY = this.circle.y;
            const targetX = fromX + nx * range;
            const targetY = fromY + ny * range;

            this._throw(fromX, fromY, targetX, targetY, speed);
        });
    }

    _getSpeed(ptr) {
        const now = performance.now();
        const history = [...this._history, { x: ptr.x, y: ptr.y, t: now }];
        if (history.length < 2) return 0.5;

        const recent = history.slice(-3);
        const first = recent[0];
        const last = recent[recent.length - 1];
        const dt = last.t - first.t;
        if (dt <= 0) return 0.5;

        const ddx = last.x - first.x;
        const ddy = last.y - first.y;
        return Math.sqrt(ddx * ddx + ddy * ddy) / dt; // px/ms
    }

    _drawAimLine(toX, toY) {
        this.aimLine.clear();
        this.aimLine.lineStyle(2, 0xffffff, 0.3);
        this.aimLine.beginPath();
        this.aimLine.moveTo(this.dragStartX, this.dragStartY);
        this.aimLine.lineTo(toX, toY);
        this.aimLine.strokePath();
    }

    _throw(fromX, fromY, targetX, targetY, speed) {
        this.isFlying = true;

        // Arc plus haut si lancer rapide
        const arcHeight = Phaser.Math.Clamp(speed * 150, 100, 300);
        const ctrlX = (fromX + targetX) / 2;
        const ctrlY = Math.min(fromY, targetY) - arcHeight;

        // Durée inversement proportionnelle à la vitesse
        const duration = Phaser.Math.Clamp(
            400 / Math.max(speed, 0.3),
            250,
            500,
        );

        const tween = { t: 0 };

        this.scene.tweens.add({
            targets: tween,
            t: 1,
            duration,
            ease: "Linear",
            onUpdate: () => {
                const t = tween.t;
                const inv = 1 - t;
                const bx =
                    inv * inv * fromX + 2 * inv * t * ctrlX + t * t * targetX;
                const by =
                    inv * inv * fromY + 2 * inv * t * ctrlY + t * t * targetY;
                this.circle.setPosition(bx, by);
            },
            onComplete: () => {
                this.onThrow(targetX, targetY);
            },
        });
    }

    reset() {
        this.isFlying = false;
        this.isDragging = false;
        this._history = [];
        this.aimLine.clear();

        this.circle.setVisible(true).setAlpha(1).setDepth(10);
        this.circle.setPosition(this.startX, this.startY);
    }

    destroy() {
        this.scene.input.off("pointerdown");
        this.scene.input.off("pointermove");
        this.scene.input.off("pointerup");
        this.aimLine.destroy();
        this.circle.destroy();
    }
}
