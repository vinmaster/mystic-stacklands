import Phaser from 'phaser';
import { MainGame } from '../scenes/MainGame';

const CONSTANTS = {
  CARD_WIDTH: 100,
  CARD_HEIGHT: 150,
  CARD_RADIUS: 10,
};

export default class Card extends Phaser.GameObjects.Container {
  graphics: Phaser.GameObjects.Graphics;
  clickedBy?: string;

  constructor(scene: MainGame, x: number, y: number) {
    super(scene, x, y);

    this.name = 'Card';

    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0xffff00, 0.8);
    this.graphics.fillRoundedRect(
      0,
      0,
      CONSTANTS.CARD_WIDTH,
      CONSTANTS.CARD_HEIGHT,
      CONSTANTS.CARD_RADIUS
    );
    this.add(this.graphics);

    let slime = scene.add.image(50, 50, 'slime');
    slime.scale = 3;
    this.add(slime);

    let cardText = scene.add.text(30, 100, 'Card');
    cardText.setColor('black');
    this.add(cardText);

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, CONSTANTS.CARD_WIDTH, CONSTANTS.CARD_HEIGHT),
      Phaser.Geom.Rectangle.Contains
    ).on('pointerdown', this.onClick);
  }

  onClick(event: any) {
    let sessionId = (this.scene as MainGame).room.sessionId;
    if (this.clickedBy === sessionId) {
      this.clickedBy = undefined;
    } else {
      this.clickedBy = sessionId;
    }
  }
}
