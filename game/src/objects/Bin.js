import { COLORS } from "../config.js";

const BIN_RX = 52;
const BIN_RY = 16;
const BIN_BOTTOM_RX = 40;

export default class Bin {
    constructor(scene, x, openingY, floorY, type) {
        this.scene = scene;
        this.type = type;
        this.baseX = x;
        this.openingY = openingY;
        this.floorY = floorY;
        this._color = type === "VRAI" ? COLORS.true : COLORS.false;

        // L'ombre est dessinée sous le corps (depth 4), le corps par dessus (depth 5)
        this.shadow = scene.add.graphics().setDepth(4);
        this.graphics = scene.add.graphics().setDepth(5);

        this.label = scene.add
            .text(x, openingY - 24, type, {
                fontSize: "13px",
                color: "#ffffff",
                fontFamily: "monospace",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setDepth(7);

        this._draw(this._color);
    }

    _draw(color) {
        const x = this.baseX;
        const oy = this.openingY;
        const fy = this.floorY;

        // Ombre : ellipse plate centrée sur la base, sur le sol
        // Large et très aplatie pour simuler une ombre au sol en perspective
        this.shadow.clear();
        this.shadow.fillStyle(0x000000, 0.4);
        this.shadow.fillEllipse(x, fy, BIN_BOTTOM_RX * 2.8, BIN_RY * 1.0);

        const g = this.graphics;
        g.clear();

        // Corps trapèze
        g.fillStyle(color, 0.82);
        g.fillPoints(
            [
                { x: x - BIN_RX, y: oy },
                { x: x + BIN_RX, y: oy },
                { x: x + BIN_BOTTOM_RX, y: fy },
                { x: x - BIN_BOTTOM_RX, y: fy },
            ],
            true,
        );

        // Relief gauche (sombre)
        g.fillStyle(0x000000, 0.2);
        g.fillPoints(
            [
                { x: x - BIN_RX, y: oy },
                { x: x - BIN_RX + 8, y: oy },
                { x: x - BIN_BOTTOM_RX + 6, y: fy },
                { x: x - BIN_BOTTOM_RX, y: fy },
            ],
            true,
        );

        // Relief droit (plus sombre)
        g.fillStyle(0x000000, 0.38);
        g.fillPoints(
            [
                { x: x + BIN_RX - 8, y: oy },
                { x: x + BIN_RX, y: oy },
                { x: x + BIN_BOTTOM_RX, y: fy },
                { x: x + BIN_BOTTOM_RX - 6, y: fy },
            ],
            true,
        );

        // Base de la corbeille posée sur le sol (ellipse sombre)
        g.fillStyle(0x000000, 0.6);
        g.fillEllipse(x, fy, BIN_BOTTOM_RX * 2, BIN_RY * 1.0);

        // Bord de l'ouverture
        g.fillStyle(color, 1);
        g.fillEllipse(x, oy, BIN_RX * 2, BIN_RY * 2);

        // Creux intérieur
        g.fillStyle(0x050510, 0.95);
        g.fillEllipse(x, oy, (BIN_RX - 5) * 2, (BIN_RY - 3) * 2);

        // Contour brillant
        g.lineStyle(2, 0xffffff, 0.45);
        g.strokeEllipse(x, oy, BIN_RX * 2, BIN_RY * 2);
    }

    contains(bx) {
        return Math.abs(bx - this.baseX) <= BIN_RX * 0.85;
    }

    swallowBall(ballCircle) {
        this.scene.tweens.add({
            targets: ballCircle,
            x: this.baseX,
            y: this.openingY,
            scaleX: 0.15,
            scaleY: 0.15,
            alpha: 0,
            duration: 260,
            ease: "Cubic.easeIn",
        });
    }

    moveTo(newX) {
        this.scene.tweens.add({
            targets: this,
            baseX: newX,
            duration: 400,
            ease: "Sine.easeInOut",
            onUpdate: () => {
                this._draw(this._color);
                this.label.setX(this.baseX);
            },
        });
    }

    highlight(success) {
        const flash = success ? 0xffffff : 0x555555;
        this._draw(flash);
        this.scene.time.delayedCall(150, () => this._draw(this._color));
    }
}
