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

const right_code = 39;
const left_code = 37;
const up_code = 38;
const down_code = 40;

gameScene.init = function(){
    this.input_sprite_width = 1;
    this.play_area_width = 300;
    this.correct_input_y =  530; //px - Aonde o input deve estar quando o jogador apertar para ganhar máximo pontos
    this.correct_input_margin = 40; //px para cima e para baixo que ainda aceita o input sem erro

    this.game_is_playing = false;
    this.count = 1;

    this.array_inputs = []
    this.tamanho_segundo = 250; //Um segundo são X pixels
    //this.bpm = 136; //Quantos beats por minuto
    this.score = 0;
};

gameScene.preload = function(){
    this.load.image('bg', 'assets/gray_bg.png');
    this.load.image('correct_input_area', 'assets/correct_input_area.png')
    this.load.image('input_right', 'assets/inputs/input_right.png');
    this.load.image('input_left', 'assets/inputs/input_left.png');
    this.load.image('input_up', 'assets/inputs/input_up.png');
    this.load.image('input_down', 'assets/inputs/input_down.png');

    //Load song
    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('tarant_song', ['assets/songs/tarantella-napoletana.mp3', 'assets/songs/tarantella-napoletana.ogg']);

    //Load song inputs
    this.load.text('inputs_song', 'assets/song_inputs/tarantella_inputs.txt');
};

gameScene.create = function(positionY){
    //Keyboard mapping
    gameScene.input.keyboard.on('keydown', myOnKeyDown);
    //scene.input.keyboard.on('keyup', function (event) { /* ... */ });    

    //Get inputs
    let inputs_song = this.cache.text.get('inputs_song');
    this.arrayInputsSong = inputs_song.split('\n');
    for(let i=1; i<this.arrayInputsSong.length; i++){
        let keyCode = parseInt(this.arrayInputsSong[i].split(' ')[0])
        let positionKey = parseInt(this.arrayInputsSong[i].split(' ')[1])
        let current_input = {
            position: (-(positionKey+900)/1000)*(this.tamanho_segundo),
            key: keyCode
        }
        this.array_inputs.push(current_input);
    }

    //console.log(this.array_inputs)

    //Draw
    this.bg = this.add.image(400, 300, 'bg');

    this.area_input = this.add.image(this.play_area_width/2.0, this.correct_input_y, 'correct_input_area');
    this.area_input.setScale(this.play_area_width/100, 2*this.correct_input_margin/100.0);

    this.add.line(0,300, this.play_area_width,0, this.play_area_width, 600,  0x000000);

    //Create inputs
    for (let i=0; i<this.array_inputs.length; i++){
        let position = this.array_inputs[i].position+this.correct_input_y;
        
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
        let current_input = this.add.image(this.play_area_width/2, position, image_name);
        current_input.setScale(0.5*this.play_area_width/100, 2*this.correct_input_margin/100.0);  

        this.array_inputs[i].gameObject = current_input;
        //this.array_inputs[i].gameObject = drawInput(this.array_inputs[i], position);
    }

    //Show score
    this.score_label = this.add.text(this.play_area_width+10, 30, 'Score: ', { fontSize: '20px', fill: '#00000' });
    this.score_label.setOrigin(0,0);
    this.score_text = this.add.text(this.play_area_width+80, 30, '0', { fontSize: '20px', fill: '#00000' });
    this.score_text.setOrigin(0,0);

    //Play song
    this.song = this.sound.add('tarant_song');
};

gameScene.update = function(timestep, dt){
    if(this.game_is_playing && this.song.isPlaying){
        //update inputs positions and draw them
        let movementY = this.tamanho_segundo * dt/1000;
        for (let i=0; i<this.array_inputs.length; i++){
            this.array_inputs[i].gameObject.y = this.array_inputs[i].gameObject.y + movementY; //Precisamos contar o tempo desde o ultimo fram para ficar constante a velocidade
        }
        //Verifica se o primeir input passou o limite de baixo
        if(this.array_inputs[0].gameObject.y > (this.correct_input_y+this.correct_input_margin)){
            //Fazer animação da peça sumindo (O usuário errou, não apertou a tempo)
            this.score -= 50;
            this.array_inputs[0].gameObject.destroy();
            this.array_inputs.shift(); //Retira o primeiro elemento
            this.count+=1;
            console.log(this.count);

        }
        //console.log(this.array_inputs[0].gameObject.y)
        this.score_text.text = Math.round(this.score);
    }
};


//Auxiliary functions
function myOnKeyDown(event){
    if(gameScene.game_is_playing == false){
        gameScene.game_is_playing = true;
        gameScene.song.play();
        return;
    }
    //console.log("Apertou "+event.keyCode);
    if(event.keyCode >= 37 && event.keyCode <= 40){
        //Trata o aperto de uma seta
        //Se o próximo input estiver dentro da área de acerto:
        if(gameScene.array_inputs[0].gameObject.y >= gameScene.correct_input_y-gameScene.correct_input_margin
        && gameScene.array_inputs[0].gameObject.y <= gameScene.correct_input_y+gameScene.correct_input_margin){
            if(event.keyCode === gameScene.array_inputs[0].key){
                //Define pontuação caso acerte a tecla
                let erro = Math.abs(gameScene.array_inputs[0].gameObject.y - gameScene.correct_input_y);
                gameScene.score += gameScene.correct_input_margin - erro; //Quanto mais perto do meio mais pontos ganha
            } else {
                //Define pontuação caso erre a tecla 
                gameScene.score -= 30;
            }
            //Remove input
            gameScene.array_inputs[0].gameObject.destroy();
            gameScene.array_inputs.shift();
            gameScene.count+=1;
            console.log(gameScene.count);
        } else {
            //Tira pontos por apertar muito antes
            gameScene.score -= 30;
            //Remove input
            gameScene.array_inputs[0].gameObject.destroy();
            gameScene.array_inputs.shift();
            gameScene.count+=1;
            console.log(gameScene.count);
        }
    }
}