import { Schema, type } from '@colyseus/schema';

export class PlayerSchema extends Schema {
  @type('string')
  id: string;

  @type('number')
  x = Math.floor(Math.random() * 400);

  @type('number')
  y = Math.floor(Math.random() * 400);

  constructor(sessionId: string) {
    super();
    this.id = sessionId;
  }
}
