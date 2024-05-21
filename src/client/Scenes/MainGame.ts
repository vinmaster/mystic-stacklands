import { Scene } from 'phaser';

interface Point {
  x: number;
  y: number;
  time: number;
}

export class MainGame extends Scene {
  trail: Phaser.GameObjects.Graphics;
  points: Point[];
  head: { x: number; y: number };

  constructor() {
    super('MainGame');
  }

  preload() {
    // this.load.setPath('assets');
    // this.load.image('background', 'bg.png');
    // this.load.image('logo', 'logo.png');
  }

  create() {
    // this.game.canvas.addEventListener('touchmove', this.touchMove, false);

    this.input.on('pointermove', this.pointerMove.bind(this));

    // this.add.image(512, 384, 'background');
    // this.add.image(512, 350, 'logo').setDepth(100);
    // this.add
    //   .text(512, 490, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
    //     fontFamily: 'Arial Black',
    //     fontSize: 38,
    //     color: '#ffffff',
    //     stroke: '#000000',
    //     strokeThickness: 8,
    //     align: 'center',
    //   })
    //   .setOrigin(0.5)
    //   .setDepth(100);

    //  Default text with no style settings
    this.add.text(100, 100, 'Phaser');

    //  Pass in a basic style object with the constructor
    this.add.text(100, 200, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    //  Or chain calls like this:
    this.add.text(100, 400, 'Phaser').setFontFamily('Arial').setFontSize(64).setColor('#ffff00');

    this.trail = this.add.graphics();
    this.points = [];
    this.head = { x: 0, y: 0 };
  }

  update() {
    this.trail.clear();
    this.trail.fillStyle(0xffff00, 0.8);
    this.trail.fillCircle(this.head.x, this.head.y, 5);
    if (this.points.length > 4) {
      this.trail.lineStyle(1, 0xffff00, 1.0);
      this.trail.beginPath();
      this.trail.lineStyle(0, 0xffff00, 1.0);
      this.trail.moveTo(this.points[0].x, this.points[0].y);
      for (var index = 1; index < this.points.length - 4; ++index) {
        var point = this.points[index];
        this.trail.lineStyle(
          // linearInterpolation(index / (points.length - 4), 0, 20),
          Phaser.Math.Linear(index / (this.points.length - 4), 0, 20),
          ((0xff & 0x0ff) << 16) |
            (((Phaser.Math.Linear(index / this.points.length, 0x00, 0xff) | 0) & 0x0ff) << 8) |
            (0 & 0x0ff),
          0.5
        );
        this.trail.lineTo(point.x, point.y);
      }
      var count = 0;
      for (var index = this.points.length - 4; index < this.points.length; ++index) {
        var point = this.points[index];
        this.trail.lineStyle(
          Phaser.Math.Linear(count++ / 4, 20, 0),
          ((0xff & 0x0ff) << 16) |
            (((Phaser.Math.Linear(index / this.points.length, 0x00, 0xff) | 0) & 0x0ff) << 8) |
            (0 & 0x0ff),
          1.0
        );
        this.trail.lineTo(point.x, point.y);
      }
      this.trail.strokePath();
      this.trail.closePath();
    }
    for (var index = 0; index < this.points.length; ++index) {
      var point = this.points[index];

      point.time -= 0.5;
      if (point.time <= 0) {
        this.points.splice(index, 1);
        index -= 1;
      }
    }
  }

  destroy() {
    console.log('destroy');
  }

  pointerMove(pointer: Phaser.Input.Pointer) {
    this.head.x = pointer.x;
    this.head.y = pointer.y;

    this.points.push({ x: this.head.x, y: this.head.y, time: 4.0 });
  }

  touchMove(event: TouchEvent) {
    event.preventDefault();
  }
}
