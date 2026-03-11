import { COLORS } from "../config.js";

const BIN_RX = 52;
const BIN_RY = 16;
const BIN_BOTTOM_RX = 40;

export class Bin extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, openingY, floorY, type) {
        super(scene.matter.world, x, openingY, "green-bin");
        this.scene = scene;
        this.scene.add.existing(this);
        this.setStatic(true);
        this.setDepth(11);
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
                this.label.setX(this.baseX);
            },
        });
    }

    highlight(success) {
        // const flash = success ? 0xffffff : 0x555555;
        // this._draw(flash);
        // this.scene.time.delayedCall(150, () => this._draw(this._color));
    }
}
