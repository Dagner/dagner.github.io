

var config = {
    type: Phaser.AUTO,
    width:1024,
    height: 576,
    scale:{ parent: 'mygame',
    autoCenter: Phaser.Scale.CENTER_BOTH},
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    pixelArt: false,
    scene:[Intro,Game,TxtScene]
};



var game = new Phaser.Game(config);





//}

