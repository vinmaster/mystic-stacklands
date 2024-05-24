import { Schema, type } from '@colyseus/schema';

export class CardSchema extends Schema {
  @type('string')
  id: string;

  @type('string')
  type: string;

  @type('number')
  x = Math.floor(Math.random() * 400);

  @type('number')
  y = Math.floor(Math.random() * 400);

  constructor(id: string) {
    super();
    this.id = id;
    this.type = 'card';
  }
}
