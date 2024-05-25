import Phaser from 'phaser';
import Card from '../objects/Card';
import { Network } from '../Network';
import { GameRoomState } from '../../server/rooms/schema/GameRoomState';
import { Room } from 'colyseus.js';
import { CONSTANTS } from '../../shared/Constants';

interface Point {
  x: number;
  y: number;
  time: number;
}

export class MainGame extends Phaser.Scene {
  trail: Phaser.GameObjects.Graphics;
  points: Point[];
  cursor: Phaser.GameObjects.Image;
  otherCursors: Record<string, Phaser.GameObjects.Image> = {};
  graphics: Phaser.GameObjects.Graphics;
  card: Card;
  room: Room<GameRoomState>;

  constructor() {
    super('MainGame');
  }

  preload() {
    this.load.setPath('/');
    this.load.image('slime', 'slime.png');
    this.load.image('cursor_hand', 'cursor_hand.png');
  }

  create() {
    this.registerInputEvents();
    this.joinGameRoom();

    this.card = new Card(this, 100, 100);
    this.children.add(this.card);

    this.add.text(600, 10, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.trail = this.add.graphics();
    this.points = [];

    this.cursor = this.add.image(0, 0, 'cursor_hand');
  }

  update() {
    this.updateTrail();

    // this.children.each((child) => {
    //   if (child.name === 'Card' && (child as Card).clickedBy === this.room.sessionId) {
    //   }
    // });
  }

  destroy() {
    console.log('destroy');
  }

  async joinGameRoom() {
    this.room = await Network.client.joinOrCreate<GameRoomState>('GameRoom');

    this.room.onMessage(CONSTANTS.MESSAGE.PLAYER_MOVE, ({ sessionId, x, y }: any) => {
      if (this.otherCursors[sessionId]) {
        this.otherCursors[sessionId].x = x;
        this.otherCursors[sessionId].y = y;
      }
    });

    this.room.onMessage('CARD_MOVE', ({ sessionId, x, y }: any) => {
      this.card.x = x;
      this.card.y = y;
    });

    this.room.state.cards.onAdd((card, id) => {
      [this.card.x, this.card.y] = [card.x, card.y];
    });

    this.room.state.players.onAdd((player, sessionId) => {
      // Not self
      if (sessionId !== this.room.sessionId) {
        let cursor = this.add.image(player.x, player.y, 'cursor_hand');
        this.otherCursors[sessionId] = cursor;
      }
    });

    this.room.state.players.onRemove((player, sessionId) => {
      this.children.remove(this.otherCursors[sessionId]);
      delete this.otherCursors[sessionId];
    });
    // this.room.state.players.onChange((player, sessionId) => {
    //   if (this.otherCursors[sessionId]) {
    //     this.otherCursors[sessionId].x = player.x;
    //     this.otherCursors[sessionId].y = player.y;
    //   }
    // });
  }

  registerInputEvents() {
    // this.game.canvas.addEventListener('touchmove', this.touchMove, false);
    this.input.on('pointermove', this.pointerMove.bind(this));
  }

  pointerMove(pointer: Phaser.Input.Pointer) {
    this.cursor.x = pointer.x;
    this.cursor.y = pointer.y;

    this.room.send('PLAYER_MOVE', { x: pointer.x, y: pointer.y });

    if (this.card.clickedBy === this.room.sessionId) {
      this.card.x = pointer.x - 50;
      this.card.y = pointer.y - 100;
      this.room.send('CARD_MOVE', { x: this.card.x, y: this.card.y });
    }

    this.points.push({ x: this.cursor.x, y: this.cursor.y, time: 4.0 });
  }

  touchMove(event: TouchEvent) {
    event.preventDefault();
  }

  updateTrail() {
    this.trail.clear();
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
}
