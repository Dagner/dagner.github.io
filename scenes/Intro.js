class Intro extends Phaser.Scene
{
    constructor(){
        super('IntroScene');
    }

    preload () 
    {
        this.load.bitmapFont('news','assets/fonts/newbmpfont_40_0.png','assets/fonts/newbmpfont_40.xml');
        this.load.bitmapFont('bit','assets/fonts/pixel_fnt_0.png','assets/fonts/pixel_fnt.fnt');
        this.load.image('intro','assets/intro_caracoles.png');
        this.load.image('snail', 'assets/snail.png');
        this.load.audio('intro_music','assets/audio/intro_music.m4a');
    }
    
    create ()
    {
        this.input.keyboard.once('keydown-SPACE', () => {
            // fade to black
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        })
    
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start('TextScene')
            })
        })
        this.bg = this.add.image(0,0,'intro').setOrigin(0,0);
        this.add.bitmapText(40,50,'news','La lógica de los caracoles');
        const txt = this.add.bitmapText(512,512,'bit','Tecla espacio para continuar');
        txt.setOrigin(0.5,0.5);
        this.tweens.add({
            targets: txt,
            alpha:0,
            duration: 2000,
            repeat: -1,
            ease: 'Sine.easeInOut',
            yoyo: true
        });
        //const text = this.add.text(20, 30, 'La lógica de los caracoles' );
        //text.setOrigin(0,0);
        //text.setFontSize(40);
        this.bg.displayWidth = 1024;
        this.bg.displayHeight = 576;
        this.speed = 0.001;
        this.speed2 = 0.004; 
        this.snail = this.add.sprite(300,300, 'snail');
        this.snail.setScale(0.8);
        this.snail2 = this.add.sprite(600,200,'snail');
        this.snail2.setScale(0.7);
        this.snail2.angle = 90;
        this.music = this.sound.add('intro_music',{volume:0.2});

        this.music.play();
        this.snail.setOrigin(0.5,0.5);
        this.snail2.setOrigin(0.5,0.5);
        this.timeEvent = this.time.addEvent({delay:8000,callback:this.onEvent, callbackScope:this, repeat: 1 });
        this.x_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    snailOneMove(delta){
        this.snail.x += this.speed*delta;
    
        if (this.snail.x > 950)
        {
            this.snail.x = -150;
        }

    }

    snailTwoMove(delta){
        this.snail2.y += this.speed2*delta;

        if(this.snail2.y > 800){
            this.snail2.y = -150;
        }
    }
    
    update(time, delta) {
        this.snailOneMove(delta);
        this.snailTwoMove(delta);
    
        // if(this.x_key.isDown)
        // {
        //     this.scene.start();
        //     console.log("Hola key");
        // }
    
    }
    
    onEvent(){
        this.timeEvent.reset({ delay: Phaser.Math.RND.integerInRange(3000,6000), callback:this.onEvent, callbackScope: this, repeat: 1});
        
        const move_chance = Phaser.Math.RND.integerInRange(0,1);
        if(move_chance){
            console.log("Se mueve");
            this.speed = Phaser.Math.RND.realInRange(0.001, 0.002);
        } else {
            console.log("Quieto");
            this.speed = 0;
        }
    }
}5