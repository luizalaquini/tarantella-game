import gameScene from "./game-scene.js";
import menuScene from "./menu-scene.js";
import historyScene from "./history-scene.js";


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [
        //historyScene,
        menuScene,
        gameScene
        
        
        
        //cenaRestart
    ]
};

var game = new Phaser.Game(config);