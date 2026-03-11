import { Scene } from "phaser";
import { SCENES, COLORS } from "../config.js";

export default class Preloader extends Scene {
    constructor() {
        super({ key: SCENES.PRELOADER });
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("green-bin", "pictures/green-bin.png");
        this.load.image("paper-ball", "pictures/paper-ball.png");
    }

    create() {
        this.scene.start(SCENES.MENU);
    }
}
