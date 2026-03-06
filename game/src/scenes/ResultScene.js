import Phaser from "phaser";
export default class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: "ResultScene" });
    }
    create() {
        this.add
            .text(400, 300, "ResultScene — à venir", { color: "#ffffff" })
            .setOrigin(0.5);
    }
}
