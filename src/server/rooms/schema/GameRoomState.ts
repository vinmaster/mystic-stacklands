import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerSchema } from './PlayerSchema';
import { CardSchema } from './CardSchema';

export class GameRoomState extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  @type({ map: CardSchema })
  cards = new MapSchema<CardSchema>();

  constructor() {
    super();
    this.cards.set('Card', new CardSchema('Card'));
  }

  addPlayer(sessionId: string) {
    this.players.set(sessionId, new PlayerSchema(sessionId));
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  movePlayer(sessionId: string, data: any) {
    if (data.x) this.players.get(sessionId).x = data.x;
    if (data.y) this.players.get(sessionId).y = data.y;
  }
}
