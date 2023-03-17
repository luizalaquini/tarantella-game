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
        this.add.image(0, 0, 'b1').setOrigin(0, 0);
        // after 6 seconds change to b2
        this.time.delayedCall(7000, () => {
            this.add.image(0, 0, 'b2').setOrigin(0, 0);
        }, [], this);
        // after 12 seconds change to b3
        this.time.delayedCall(14000, () => {
            this.add.image(0, 0, 'b3').setOrigin(0, 0);
        }, [], this);
        // after 18 seconds change to menu
        this.time.delayedCall(21000, () => {
            this.scene.start('menuScene');
            //this.scene.stop();
        }, [], this);
    }

    update(){

    }
}