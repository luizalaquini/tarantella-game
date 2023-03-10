let gameScene = new Phaser.Scene("Game");

function getRandomInt(min, max) {
    return min+ Math.floor(Math.random() * (max-min));
};


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
    scene: gameScene
};

var game = new Phaser.Game(config);

const right_code = 0;
const left_code = 1;
const up_code = 2;
const down_code = 3;

gameScene.init = function(){
    this.input_sprite_width = 1;
    this.play_area_width = 300;
    this.correct_input_y =  530; //px - Aonde o input deve estar quando o jogador apertar para ganhar máximo pontos
    this.correct_input_margin = 30; //px para cima e para baixo que ainda aceita o input sem erro

    this.speed = 1;

    this.array_inputs = []
    for(let i=0; i<40; i++){
        let current_input = {
            length: getRandomInt(40, 120),
            key: getRandomInt(0,4)
        }
        this.array_inputs.push(current_input);
    }
};

gameScene.preload = function(){
    this.load.image('bg', 'assets/gray_bg.png');
    this.load.image('correct_input_area', 'assets/correct_input_area.png')
    this.load.image('input_right', 'assets/inputs/input_right.png');
    this.load.image('input_left', 'assets/inputs/input_left.png');
    this.load.image('input_up', 'assets/inputs/input_up.png');
    this.load.image('input_down', 'assets/inputs/input_down.png');
};

gameScene.create = function(positionY){
    this.bg = this.add.image(400, 300, 'bg');

    this.area_input = this.add.image(this.play_area_width/2.0, this.correct_input_y, 'correct_input_area');
    this.area_input.setScale(this.play_area_width/100, 2*this.correct_input_margin/100.0);

    this.add.line(0,300, this.play_area_width,0, this.play_area_width, 600,  0x000000);

    //Create inputs
    for (let i=0; i<this.array_inputs.length; i++){
        let position
        if(i==0){
            position = 0;
        } else {
            position = this.array_inputs[i-1].gameObject.y - (this.array_inputs[i-1].length/2) - 1;
        }


        let image_name;
        switch(this.array_inputs[i].key){
            case right_code:
                image_name = 'input_right';
                break;
            case left_code:
                image_name = 'input_left';
                break;
            case up_code:
                image_name = 'input_up';
                break;
            case down_code:
                image_name = 'input_down';
                break;
        }
        let current_input = this.add.image(this.play_area_width/2, position-(this.array_inputs[i].length/2), image_name);
        current_input.setScale(0.5*this.play_area_width/100, this.array_inputs[i].length/100);  

        this.array_inputs[i].gameObject = current_input;
        //this.array_inputs[i].gameObject = drawInput(this.array_inputs[i], position);
    }
};

gameScene.update = function(){
    //update inputs positions and draw them
    for (let i=0; i<this.array_inputs.length; i++){
        this.array_inputs[i].gameObject.y = this.array_inputs[i].gameObject.y + this.speed; //Precisamos contar o tempo desde o ultimo fram para ficar constante a velocidade
    }

    //console.log(this.array_inputs[0].gameObject.y)
};