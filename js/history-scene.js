export default class historyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'historyScene' });
    }

    preload() {
        this.load.image('b1', 'assets/history/board_1.png');
        this.load.image('b2', 'assets/history/board_2.png');
        this.load.image('b3', 'assets/history/board_3.png');
    }

    create() {
        // starts with b1 
        console.log("dsdads oiiii");
        this.add.image(400, 300, 'b1');
    }
}