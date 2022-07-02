import { getTestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import * as Phaser from 'phaser';

var highScore;

class Scene1 extends Phaser.Scene {
  playgame: any;

  constructor() {
    super('scene1');
  }

  preload(){
    this.load.image('fondo1', 'assets/images/sky.png');
    this.load.image('logo', 'assets/images/logo.png');
  }

  create(){
    this.add.image(innerWidth/2,0, 'fondo1').setScale(2);
    this.add.text(100, 150, 'Another Bird').setFontSize(30).setFontStyle('bold');
    this.add.image(innerWidth/2, innerHeight/2, 'logo');
    this.playgame =  this.add.text(85, 550, 'Play Game').setFontSize(40).setColor('white').setStroke('black', 20);
    this.playgame.setInteractive();
    this.playgame.on('pointerdown', function(){
      this.scene.start('scene2');
    }, this);
    
  }

  update(){
    
  }

}

class Scene2 extends Phaser.Scene {
  bird: Phaser.Physics.Arcade.Sprite;
  arrowLeft: Phaser.GameObjects.Image;
  arrowRight: Phaser.GameObjects.Image;

  balloonBlue: Phaser.Physics.Arcade.Image;
  balloonGreen: Phaser.Physics.Arcade.Image;
  balloonRed: Phaser.Physics.Arcade.Image;

  balloonStar: Phaser.Physics.Arcade.Image;

  score = 0;
  scoreText: Phaser.GameObjects.Text;
  gameOverText: Phaser.GameObjects.Text;

  audioGloboColores: Phaser.Sound.BaseSound;
  audioGloboStar: Phaser.Sound.BaseSound;
  audioJuego: Phaser.Sound.BaseSound;

  contadorText: Phaser.GameObjects.Text;
  indiceContador = 1;
  contador = 90;

  contadorGameOver = 0;

  constructor() {
    super('scene2');
  }

  preload(){
    this.load.image('fondo1', 'assets/images/sky.png');
    this.load.spritesheet('bird', 'assets/images/birdsprite.png',
      { frameWidth: 35, frameHeight: 33 }
    );
    this.load.image('arrowLeft', 'assets/images/arrow-left.png');
    this.load.image('arrowRight', 'assets/images/arrow-right.png');

    this.load.image('balloonBlue', 'assets/images/balloon-blue.png');
    this.load.image('balloonGreen', 'assets/images/balloon-green.png');
    this.load.image('balloonRed', 'assets/images/balloon-red.png');

    this.load.image('balloonStar', 'assets/images/balloon-star.png');

    this.load.audio('audioglobocolores', 'assets/sounds/balloon.mp3');
    this.load.audio('audioglobostar', 'assets/sounds/star.mp3');
    this.load.audio('audiojuego', 'assets/sounds/ost.mp3');
  }

  

  create(){
    
    

    this.audioGloboColores = this.sound.add('audioglobocolores');
    this.audioGloboStar = this.sound.add('audioglobostar');
    this.audioJuego = this.sound.add('audiojuego');
    this.audioJuego.play({loop: true, volume: 0.5});

    this.add.image(innerWidth/2,0, 'fondo1').setScale(2);
    this.bird = this.physics.add.sprite(innerWidth/2, innerHeight/3, 'bird');
    this.bird.setCollideWorldBounds(true);
    this.bird.setImmovable(true);
    this.arrowLeft = this.add.image(50, innerHeight-50, 'arrowLeft').setInteractive();
    this.arrowRight = this.add.image(innerWidth-50, innerHeight-50, 'arrowRight').setInteractive();

    // game over
    this.gameOverText = this.add.text(100, innerHeight/2, 'Game Over', { fontSize: '36px', fill: '#000' });
    this.gameOverText.visible = false;

    this.arrowLeft.on('pointerdown', function(){
      this.bird.setVelocityX(-100);
      this.bird.anims.play('walk-left', true);
    }, this);

    this.arrowLeft.on('pointerup', function(){
      this.bird.setVelocityX(0);
     // this.bird.anims.play('walk-left', true);
    }, this);

    this.arrowRight.on('pointerdown', function(){
      this.bird.setVelocityX(100);
      this.bird.anims.play('walk-right', true);
    }, this);

    this.arrowRight.on('pointerup', function(){
      this.bird.setVelocityX(0);
     // this.bird.anims.play('walk-left', true);
    }, this);
    
    // animacion hacia la derecha
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('bird', { start:0 , end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    //this.bird.anims.play('walk-right', true);
    //this.bird.setVelocityX(100);

    // animacion hacia la izquierda
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('bird', { start: 15 , end: 20 }),
      frameRate: 10,
      repeat: -1
    });
    //this.bird.anims.play('walk-left', true);
    //this.bird.setVelocityX(-100);
    
    
    

    let globoEstrella = 0;
  

    //score text
    this.scoreText = this.add.text(16, 16, 'SCORE: 0', { fontSize: '18px', fill: '#000' });
    //cuenta atras
    this.contadorText = this.add.text(16, 32, 'TIMER: 90', { fontSize: '18px', fill: '#000' });
    
    this.time.addEvent({
      delay: 3000,
      repeat: 1,
      callback: ()=>{
            // spawn a new apple
        
      // globos
      let velocidadGlobo = Phaser.Math.Between(-20, -70);
      let colorGlobo = Phaser.Math.Between(1, 3);
      let globoX = Phaser.Math.Between(20, innerWidth-20);
      let tiempoNuevoGlobo = Math.floor(Math.random() * (1 - 5 + 1) + 1);
      
      if(globoEstrella == 3){
        globoEstrella = 0;
        this.balloonStar = this.physics.add.image(globoX, innerHeight, 'balloonStar').setInteractive();
        for(let i=0; i < 20; i++){
          this.balloonStar.setVelocityY(velocidadGlobo).setFrame(10);
        }
      }else{
        globoEstrella++;
        if (colorGlobo == 1){
        
          this.balloonBlue = this.physics.add.image(globoX, innerHeight, 'balloonBlue').setInteractive();
          
          for(let i=0; i < 20; i++){
            this.balloonBlue.setVelocityY(velocidadGlobo).setFrame(10);
            
          }
        }
        if (colorGlobo == 2){
          
          this.balloonGreen = this.physics.add.image(globoX, innerHeight, 'balloonGreen').setInteractive();
            
          
          for(let i=0; i < 20; i++){
            this.balloonGreen.setVelocityY(velocidadGlobo).setFrame(10);
      
          }
        }
        if (colorGlobo == 3){
          
                
          this.balloonRed = this.physics.add.image(globoX, innerHeight, 'balloonRed').setInteractive();
            
          
          for(let i=0; i < 20; i++){
            this.balloonRed.setVelocityY(velocidadGlobo).setFrame(10);
      
          }
        }
      }

      
      

      this.physics.add.overlap(this.bird, this.balloonBlue, this.collectGloboBlue, null, this); 
      this.physics.add.overlap(this.bird, this.balloonGreen, this.collectGloboGreen, null, this); 
      this.physics.add.overlap(this.bird, this.balloonRed, this.collectGloboRed, null, this); 

      this.physics.add.overlap(this.bird, this.balloonStar, this.collectGloboStar, null, this); 

      },
      loop: true
    })


    
      

  }


  collectGloboBlue(player, globo){
    this.score += 5;
    this.scoreText.setText('SCORE: ' + this.score);
    globo.disableBody(true, true);
    this.audioGloboColores.play();
  }

  collectGloboGreen(player, globo){
    this.score += 10;
    this.scoreText.setText('SCORE: ' + this.score);
    globo.disableBody(true, true);
    this.audioGloboColores.play();
  }

  collectGloboRed(player, globo){
    this.score += 20;
    this.scoreText.setText('SCORE: ' + this.score);
    globo.disableBody(true, true);
    this.audioGloboColores.play();
  }

  collectGloboStar(player, globo){
    globo.disableBody(true, true);
    this.audioGloboStar.play();
    //this.bird.setVelocityX(200);
    this.arrowLeft.on('pointerdown', function(){
      this.bird.setVelocityX(-200);
      this.bird.anims.play('walk-left', true);
    }, this);
    this.arrowRight.on('pointerdown', function(){
      this.bird.setVelocityX(200);
      this.bird.anims.play('walk-right', true);
    }, this);
  }

  update(){

    if(this.contador == 0){
      console.log('GAME OVER');
      this.gameOverText.visible = true;

      highScore = this.score;

      this.time.addEvent({
        delay: 5000,
        repeat: 1,
        callback: ()=>{
          this.scene.start('scene3');
        },
        loop: true
      })

    }else if(this.indiceContador < 60){
      this.indiceContador++;
    }else{
      this.indiceContador = 1;
      this.contador--;
      this.contadorText.setText('TIMER: ' + this.contador);
      console.log(this.contador);
    }

    
    
    
    
  }

}

class Scene3 extends Phaser.Scene {
  higherScoretText: Phaser.GameObjects.Text;
  playAgain: any;
  constructor() {
    super('scene3');
  }
  preload(){
    this.load.image('fondo1', 'assets/images/sky.png');
  }
  create(){
    this.add.image(innerWidth/2,0, 'fondo1').setScale(2);

    // puntuaciones
    this.higherScoretText = this.add.text(16,16, 'HIGHER: 0', { fontSize: '16px', fill: '#000'});
    localStorage.setItem('higher', highScore);
    this.higherScoretText.setText('HIGHER: ' + localStorage.getItem('higher'));

    this.playAgain = this.add.text(100,innerHeight/2, 'Play Again', { fontSize: '32px', fill: '#000'});
    this.playAgain.setInteractive();
    this.playAgain.on('pointerdown', function(){
      this.scene.start('scene2');
    }, this);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  game: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: innerWidth,
      height: innerHeight,
      physics: {
        default: 'arcade'
      },
      parent: 'game',
      scene: [Scene1, Scene2, Scene3],
    
    }
  }

  

  ngOnInit(){
    this.game = new Phaser.Game(this.config);
  }
}
