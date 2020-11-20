class Game extends Phaser.Scene
{
    constructor(){
        super('GameScene');
        
    }

    preload(){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.load.image('gray_wall','assets/tileset/Dungeon32x32.png');
        this.load.image('plants','assets/tileset/plants.png')
        this.load.tilemapTiledJSON('map', 'assets/tileset/snail_tilemap.json');
        this.load.image('snail2', 'assets/snail3.png');
        this.load.image('snail3','assets/snail4.png');
        this.load.audio('eat_sound', 'assets/audio/eat.wav');
        this.load.audio('fail_sound', 'assets/audio/fail.wav');
        this.load.audio('bushHit', 'assets/audio/bush.wav');
        this.load.audio('bushEat', 'assets/audio/eat_bush.mp3');
        this.addKeys();
        
    }

    addKeys(){
        this.p1_keys = {};
        this.p1_keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.p1_keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.p1_keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.p1_keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.p2_keys = {};
        this.p2_keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.p2_keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.p2_keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.p2_keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    }

    create(){

        this.gameover = false;
        this.p1_hp = 500;
        this.p2_hp = 500;
        const map = this.make.tilemap({key:'map'});
        const tiles = map.addTilesetImage('gray_wall');
        const mushTiles = map.addTilesetImage('plants');
        const wallsLayer = map.createDynamicLayer('walls',tiles,0,0);
        this.foodLayer = map.createDynamicLayer('mushrooms',mushTiles,0,0);
    
        wallsLayer.setCollisionBetween(0,76);
        this.foodLayer.setTileIndexCallback(433,this.onFoodEat, this);
        this.foodLayer.setCollision([223,162]);
        this.foodLayer.setTileIndexCallback([223,162],this.onFenceCollision, this);
        
        
        this.snail = new Snail(this,50,100,'snail2',this.p1_keys);
        this.snail2 = new Snail(this,100,100,'snail3',this.p2_keys);
        this.eatSnd = this.sound.add('eat_sound');
        this.failSnd = this.sound.add('fail_sound');
        this.bushSnd = this.sound.add('bushHit');
        this.bushEatSnd = this.sound.add('bushEat');
        this.physics.add.collider(wallsLayer,[this.snail,this.snail2]);
        this.physics.add.collider(this.foodLayer,[this.snail,this.snail2]);
        //this.info_txt = this.add.text(40,500, ' ', {fill: '#000000'});

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('GameScene')
        })
    }

    update() {
        this.snail.move();
        this.snail2.move();
    }


    onFoodEat(sprite, tile){
        console.log(sprite.name);
        this.foodLayer.removeTileAt(tile.x, tile.y);
        this.eatSnd.play();
        if(sprite.name == 'snail2'){
            //this.p1_hp+= 50;
            this.snail.hp.increase(30);
        } else if(sprite.name == 'snail3'){
            console.log("Choca con snail2");
            this.snail2.hp.increase(30);
            //this.p2_hp+= 50;
        }
        return false;
    }

    onFenceCollision(sprite, tile){
        console.log(tile.index); 
        if(sprite.name == 'snail2' && tile.index == 223){
            this.foodLayer.removeTileAt(tile.x, tile.y);
            if(!this.bushEatSnd.isPlaying)
                this.bushEatSnd.play();
        } else if(sprite.name == 'snail3' && tile.index == 162){
            this.foodLayer.removeTileAt(tile.x, tile.y);
            if(!this.bushEatSnd.isPlaying)
                this.bushEatSnd.play();
        } else {
            if(!this.bushSnd.isPlaying)
                this.bushSnd.play();
        }

    }
}

class Snail extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, keys){
        super(scene, x,y,name);
        this.name = name;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(30,30,true);
        this.allowGravity = false;
        const w = 30;
        const h = 10;
        this.hp = new HealthBar(scene, this.x-w/2, this.y-30,w,h);
        this.hp.draw();
        this.keys = keys;
    }

    move(){
        this.setVelocity(0,0);
        if (this.keys.left.isDown)
        {
            //this.snail.x -= 4;
            this.angle -= 1;
        }
        else if (this.keys.right.isDown)
        {
            //this.snail.x += 4;
            this.angle += 1;
        }
    
        if (this.keys.up.isDown)
        {
            
            //this.p1_hp-=0.1;
            
            const vx = Math.cos(this.rotation)*10;
            const vy = Math.sin(this.rotation)*10;
             //this.snail.x += vx;
             //this.snail.y += vy;
            this.body.setVelocity(vx,vy);
            this.hp.x = this.x-this.hp.w/2;
            this.hp.y = this.y-30;
            this.hp.decrease(0.03 );
        }

        if(Math.abs(this.body.velocity.length()) < 0.01){
            //console.log("Estoy en idle");
            this.hp.increase(0.02);
        }

    }
}


class HealthBar {

    constructor (scene, x, y, w, h)
    {
        this.scene = scene;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 1.0;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.value = 100;
        this.p = (this.w-4) / 100;
        this.draw();
        scene.add.existing(this.bar);
    }

    increase(amount){
        this.value += amount;
        if(this.value > 100){
            this.value = 100;
        }
        this.draw();
        return this.value;
    }

    decrease (amount)
    {
        this.value -= amount;

        if (this.value < 0)
        {
            if(!this.gameover){
                this.gameover = true;
                this.scene.failSnd.play();
                this.scene.cameras.main.fadeOut(1000, 0, 0, 0);

            }
            //this.scene.start('GameScene');
           //this.bar.scene.start('GameScene');
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.w, this.h);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, this.w-4, this.h-4);

        if (this.value < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, this.h-4);
    }

}