class TxtScene extends Phaser.Scene
{
    constructor(){
        super('TextScene');
    }


    preload(){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.load.image('textImg','assets/caracoltxt.png');
       
    }

    create(){
        this.input.keyboard.once('keydown-SPACE', () => {
            // fade to black
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        })
    
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene')
            })
        })
        this.img = this.add.image(0,0,'textImg').setOrigin(0,0);
        const txt = this.add.bitmapText(800,512,'bit','Tecla espacio');
        txt.tint = 0x555555;
    }

}