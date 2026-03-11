import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "./config.js";

// Import des scènes
import BootScene from "./scenes/BootScene.js";
import GameScene from "./scenes/GameScene.js";
import MenuScene from "./scenes/MenuScene.js";
import ResultScene from "./scenes/ResultScene.js";
import Preloader from "./scenes/Preloader.js";

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLORS.background,
    parent: "game-container",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    },
    physics: {
        default: "matter",
    },
    matter: {
        debug: false,
    },
    scene: [BootScene, Preloader, MenuScene, GameScene, ResultScene],
};

new Phaser.Game(config);
