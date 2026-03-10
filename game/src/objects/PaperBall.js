import { COLORS } from "../config.js";

// Réglages
const THROW_WINDOW_MS = 150;
const GRAVITY = 0.4;
const SPEED_SCALE = 0.8;

const SCALE_NEAR = 1.0; // taille au départ (proche joueur)
const SCALE_MIN = 1.0 / 3.0; // taille minimale = taille d'origine / 3

export default class PaperBall {
    constructor(scene, x, y, onThrow) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        this.onThrow = onThrow;

        this.isDragging = false;
        this.isFlying = false;
        this._checkedBin = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this._history = [];
        this._vx = 0;
        this._vy = 0;

        // Scale courant : ne peut que décroître une fois lancée
        this._currentScale = SCALE_NEAR;

        this.circle = scene.add
            .circle(x, y, 22, COLORS.paper)
            .setStrokeStyle(2, 0xccccaa)
            .setDepth(10);

        this.aimLine = scene.add.graphics().setDepth(9);
        this._setupInput();
        scene.events.on("update", this._update, this);
    }

    _update() {
        if (!this.isFlying) return;

        this._vy += GRAVITY;
        const newX = this.circle.x + this._vx;
        const newY = this.circle.y + this._vy;
        this.circle.setPosition(newX, newY);

        // Perspective : rétrécit proportionnellement à la montée
        // t = 0 au départ, augmente en montant
        const t = Phaser.Math.Clamp(
            (this.startY - newY) / (this.startY - 0),
            0,
            1,
        );
        const wantScale = Phaser.Math.Linear(SCALE_NEAR, SCALE_MIN, t);

        // La balle ne peut que rétrécir : on prend le minimum atteint
        // → elle ne regrandit pas quand elle redescend, mais ne passe pas sous SCALE_MIN
        this._currentScale = Math.max(
            SCALE_MIN,
            Math.min(this._currentScale, wantScale),
        );
        this.circle.setScale(this._currentScale);
        this.circle.setDepth(Phaser.Math.Linear(12, 4, t));
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
            this._history.push({ x: ptr.x, y: ptr.y, t: performance.now() });
        });

        scene.input.on("pointerup", (ptr) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.aimLine.clear();

            const now = performance.now();
            const fullHistory = [
                ...this._history,
                { x: ptr.x, y: ptr.y, t: now },
            ];
            const ref =
                fullHistory.find((p) => p.t >= now - THROW_WINDOW_MS) ??
                fullHistory[0];
            const last = fullHistory[fullHistory.length - 1];

            const dx = last.x - ref.x;
            const dy = last.y - ref.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const dt = last.t - ref.t;

            if (dist < 10 || dt <= 0) {
                this._vx = 0;
                this._vy = 0;
                this.isFlying = true;
                this._checkedBin = false;
                return;
            }

            const speed = (dist / dt) * 16 * SPEED_SCALE;
            this._vx = (dx / dist) * speed;
            this._vy = (dy / dist) * speed;
            this.isFlying = true;
            this._checkedBin = false;
        });
    }

    _drawAimLine(toX, toY) {
        this.aimLine.clear();
        this.aimLine.lineStyle(2, 0xffffff, 0.3);
        this.aimLine.beginPath();
        this.aimLine.moveTo(this.dragStartX, this.dragStartY);
        this.aimLine.lineTo(toX, toY);
        this.aimLine.strokePath();
    }

    reset() {
        this.isFlying = false;
        this.isDragging = false;
        this._checkedBin = false;
        this._currentScale = SCALE_NEAR;
        this._history = [];
        this._vx = 0;
        this._vy = 0;
        this.aimLine.clear();

        this.circle
            .setVisible(true)
            .setAlpha(1)
            .setScale(SCALE_NEAR)
            .setDepth(10)
            .setPosition(this.startX, this.startY);
    }

    destroy() {
        this.scene.events.off("update", this._update, this);
        this.scene.input.off("pointerdown");
        this.scene.input.off("pointermove");
        this.scene.input.off("pointerup");
        this.aimLine.destroy();
        this.circle.destroy();
    }
}
