import { Room, Client } from '@colyseus/core';
import { GameRoomState } from './schema/GameRoomState';
import { CONSTANTS } from '../../shared/Constants';

export class GameRoom extends Room<GameRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new GameRoomState());

    this.onMessage(CONSTANTS.MESSAGE.PLAYER_MOVE, (client, data) => {
      // this.state.movePlayer(client.sessionId, data);
      data.sessionId = client.sessionId;
      this.broadcast(CONSTANTS.MESSAGE.PLAYER_MOVE, data, { except: client });
    });

    this.onMessage('CARD_MOVE', (client, data) => {
      // this.state.movePlayer(client.sessionId, data);
      data.sessionId = client.sessionId;
      this.broadcast('CARD_MOVE', data, { except: client });
    });
  }

  onJoin(client: Client, options: any) {
    // console.log(client.sessionId, 'joined!');
    this.state.addPlayer(client.sessionId);
  }

  onLeave(client: Client, consented: boolean) {
    // console.log(client.sessionId, 'left!');
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log('GameRoom', this.roomId, 'disposing...');
  }
}
