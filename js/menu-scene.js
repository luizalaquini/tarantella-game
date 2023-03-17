export default class menuScene extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  init(lastscore){
    if(!isNaN(lastscore)){
      this.lastScore = lastscore;
    }
  }

  preload() {
    this.load.image("menu", 'assets/menu_with_blur.png');
    this.load.image("play", 'assets/play_button.png');
  }

  create() {
    // Add the menu image
    this.add.image(0, 0, "menu").setOrigin(0, 0);
    // Add the play button in the center
    this.add.image(400, 300, "play").setInteractive();
    // Add last score
    if(!isNaN(this.lastScore)){
      this.score_text = this.add.text(400, 200, `Último score: ${Math.round(this.lastScore)}`, { fontSize: '40px', fill: '#ffffff' });
      this.score_text.setOrigin(0.5, 0.5);
    }
    // when the play button is clicked, start the game
    this.input.on("gameobjectdown", (pointer, gameObject) => {
      this.scene.start("gameScene");
    });
  }
}
