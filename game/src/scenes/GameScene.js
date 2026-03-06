import Phaser from "phaser";
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }
    create() {
        this.add
            .text(400, 300, "GameScene — à venir", { color: "#ffffff" })
            .setOrigin(0.5);
    }
}
