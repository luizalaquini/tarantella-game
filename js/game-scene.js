export default class gameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "gameScene"
        });
    }

    init(){
        this.right_code = 39;
        this.left_code = 37;
        this.up_code = 38;
        this.down_code = 40;

        this.input_sprite_width = 1;
        this.play_area_width = 400;
        this.correct_input_y =  492; //px - Aonde o input deve estar quando o jogador apertar para ganhar máximo pontos
        this.correct_input_margin = 50; //px para cima e para baixo que ainda aceita o input sem erro

        this.time_elapsed_feedback = 0;
        this.time_total_feedback = 1;

        this.game_is_playing = true;
        this.count = 1;
        this.timeElapsed = 0;
        this.song_speed = 1;
        this.max_song_speed = 1.4;
        this.key_is_pressed = false;

        this.array_inputs = []
        this.tamanho_segundo = 250; //Um segundo são X pixels
        //this.bpm = 136; //Quantos beats por minuto
        this.score = 0;
        this.qtdErros = 0;
        this.qtdErrosMax = 5;
    };

    preload(){
        //Load in game menu
        this.load.image('bg', 'assets/in_game.png');
        //this.load.image('correct_input_area', 'assets/correct_input_area.png')
        
        //Load input images
        this.load.image('input_right', 'assets/inputs/right_arrow.png');
        this.load.image('input_left', 'assets/inputs/left_arrow.png');
        this.load.image('input_up', 'assets/inputs/up_arrow.png');
        this.load.image('input_down', 'assets/inputs/down_arrow.png');

        //Load male character's dance moves
        this.load.spritesheet("male_movelist", "assets/male_character_movelist/male_movelist.png", { frameWidth: 500, frameHeight: 400 });



        //Load song
        //  Firefox doesn't support mp3 files, so use ogg
        this.load.audio('tarant_song', ['assets/songs/tarantella-napoletana.mp3', 'assets/songs/tarantella-napoletana.ogg']);

        //Load song inputs
        this.load.text('inputs_song', 'assets/song_inputs/tarantella_inputs.txt');

        
    };

    create(){
        //Keyboard mapping
        this.input.keyboard.on('keydown', this.myOnKeyDown);
        this.input.keyboard.on('keyup', this.myOnKeyUp);
        //scene.input.keyboard.on('keyup', function (event) { /* ... */ });    

        //Draw
        this.bg = this.add.image(400, 300, 'bg');
        this.dance = this.add.image(600, 400, 'male_movelist').setFrame(0);
        //this.area_input = this.add.image(this.play_area_width/2.0, this.correct_input_y, 'correct_input_area');
        //this.area_input.setScale(this.play_area_width/100, 2*this.correct_input_margin/100.0);

        //Show score
        this.score_label = this.add.text(this.play_area_width+10, 30, 'Pontuação: ', { fontSize: '20px', fill: '#ffffff' });
        this.score_label.setOrigin(0,0);
        this.score_text = this.add.text(this.play_area_width+130, 30, '0', { fontSize: '20px', fill: '#ffffff' });
        this.score_text.setOrigin(0,0);

        //Show qtd erros
        this.erro_label = this.add.text(this.play_area_width+10, 60, 'Dispersão do veneno: ', { fontSize: '20px', fill: '#ffffff' });
        this.erro_label.setOrigin(0,0);
        this.erro_text = this.add.text(this.play_area_width+250, 60, '0%', { fontSize: '20px', fill: '#ffffff' });
        this.erro_text.setOrigin(0,0);

        //Show feedback
        this.text_feedback = this.add.text(this.play_area_width/2+28, 
        this.correct_input_y, '', { fontSize: '20px', fill: '#ffffff' });
        this.text_feedback.setOrigin(0.5, 0.5);

        //Play song
        this.song = this.sound.add('tarant_song');
        
        this.createInputs(); 
        this.time.delayedCall(1000, () => {
            this.song.play(); 
        }, [], this);  
    };

    update(timestep, dt){
        if(this.array_inputs.length <= 0){
            if(this.timeElapsed > 1000){
                this.timeElapsed = 0;
                this.createInputs();
                this.song.stop();
                this.song.play();
                this.game_is_playing = true;
            } else {
                this.game_is_playing = false;
                this.timeElapsed += dt;
            }
        }
        if(this.game_is_playing && this.song.isPlaying){
            //Update song speed
            this.song_speed += 0.0010*dt/1000;
            if(this.song_speed > this.max_song_speed){
                this.song_speed = this.max_song_speed;
            }
            //Count feedback time
            this.time_elapsed_feedback += dt/1000;
            if(this.time_elapsed_feedback > this.time_total_feedback/this.song_speed){
                this.text_feedback.setText("");
            }
            this.song.setRate(this.song_speed);
            //update inputs positions and draw them
            let movementY = this.song_speed*this.tamanho_segundo * dt/1000;
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
                this.qtdErros+=1;
                this.text_feedback.setText('Errore')
                this.text_feedback.setStyle({ fontSize: '20px', fill: '#000000' });
                this.time_elapsed_feedback = 0;
            }
            this.score_text.text = Math.round(this.score);
            this.erro_text.text = (Math.round(100*this.qtdErros/this.qtdErrosMax)).toString() + "%"
        }
        if(this.qtdErros >= this.qtdErrosMax){
            //Perdeu!
            this.song.stop();
            this.scene.start("menuScene", this.score);
            this.scene.stop();
        } 
    };


    //Auxiliary functions
    myOnKeyDown(event){
        if(this.scene.key_is_pressed){
            return;
        }
        this.scene.key_is_pressed = true;
        if(this.scene.game_is_playing == false){
            this.scene.game_is_playing = true;
            this.scene.song.play();
            return;
        } 
        if(event.keyCode >= 37 && event.keyCode <= 40){
            //Trata o aperto de uma seta
            ///DESENHA O JOGADOR
            if(event.keyCode == this.scene.right_code){
                this.scene.dance.setFrame(1);
            }
            else if(event.keyCode == this.scene.left_code){
                this.scene.dance.setFrame(2);
            }
            else if(event.keyCode == this.scene.up_code){
                this.scene.dance.setFrame(3);
            }
            else if(event.keyCode == this.scene.down_code){
                this.scene.dance.setFrame(4);
            }
            //Se o próximo input estiver dentro da área de acerto:
            if(this.scene.array_inputs[0].gameObject.y 
                >= this.scene.correct_input_y-this.scene.correct_input_margin
            && this.scene.array_inputs[0].gameObject.y <= this.scene.correct_input_y+this.scene.correct_input_margin){
                if(event.keyCode === this.scene.array_inputs[0].key){
                    //Define pontuação caso acerte a tecla
                    let erro = Math.abs(this.scene.array_inputs[0].gameObject.y - this.scene.correct_input_y);
                    this.scene.score += this.scene.correct_input_margin - erro; //Quanto mais perto do meio mais pontos ganha

                    //Da feedback sobre o acerto
                    if((this.scene.correct_input_margin - erro) > 40){
                        this.scene.text_feedback.setText('Perfetto')
                        this.scene.text_feedback.setStyle({ fontSize: '20px', fill: '#21f26c' });
                        this.scene.time_elapsed_feedback = 0;
                    } else {
                        this.scene.text_feedback.setText('Buono')
                        this.scene.text_feedback.setStyle({ fontSize: '20px', fill: '#ffffff' });
                                                
                        this.scene.time_elapsed_feedback = 0;
                    }
                } else {
                    //Define pontuação caso erre a tecla 
                    this.scene.score -= 30;
                    this.scene.qtdErros+=1;
                    this.scene.text_feedback.setText('Errore')
                    this.scene.text_feedback.setStyle({ fontSize: '20px', fill: '#000000' });
                    this.scene.time_elapsed_feedback = 0;
                }
                //Remove input
                this.scene.array_inputs[0].gameObject.destroy();
                this.scene.array_inputs.shift();
                this.scene.count+=1;
            } else {
                //Tira pontos por apertar muito antes
                this.scene.score -= 30;
                //Remove input
                this.scene.array_inputs[0].gameObject.destroy();
                this.scene.array_inputs.shift();
                this.scene.count+=1;
                this.scene.qtdErros+=1;
                this.scene.text_feedback.setText('Errore')
                this.scene.text_feedback.setStyle({ fontSize: '20px', fill: '#000000' });
                this.scene.time_elapsed_feedback = 0;
            }
        }
    }

    myOnKeyUp(event){
        this.scene.key_is_pressed = false;
    }


    createInputs(){
        this.array_inputs = []
        //Get inputs
        let inputs_song = this.cache.text.get('inputs_song');
        this.arrayInputsSong = inputs_song.split('\n');
        for(let i=1; i<this.arrayInputsSong.length; i++){
            let keyCode = parseInt(this.arrayInputsSong[i].split(' ')[0])
            let positionKey = parseInt(this.arrayInputsSong[i].split(' ')[1])
            if(isNaN(keyCode) || isNaN(positionKey)){
                continue;
            }
            let current_input = {
                position: (-(positionKey+900)/1000)*(this.tamanho_segundo),
                key: keyCode
            }
            this.array_inputs.push(current_input);
        }

        //Create inputs
        for (let i=0; i<this.array_inputs.length; i++){
            let position = this.array_inputs[i].position+this.correct_input_y;
            
            let image_name;
            switch(this.array_inputs[i].key){
                case this.right_code:
                    image_name = 'input_right';
                    break;
                case this.left_code:
                    image_name = 'input_left';
                    break;
                case this.up_code:
                    image_name = 'input_up';
                    break;
                case this.down_code:
                    image_name = 'input_down';
                    break;
            }
            let current_input = this.add.image(this.play_area_width/2+28, position, image_name);
            //current_input.setScale(0.5*this.play_area_width/100, 2*this.correct_input_margin/100.0);  

            this.array_inputs[i].gameObject = current_input;
        }
    }

    getRandomInt(min, max) {
        return min+ Math.floor(Math.random() * (max-min));
    };
}