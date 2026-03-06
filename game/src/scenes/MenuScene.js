import Phaser from "phaser";
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenuScene" });
    }
    create() {
        this.add
            .text(400, 300, "MenuScene — à venir", { color: "#ffffff" })
            .setOrigin(0.5);
    }
}
