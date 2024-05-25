import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';

// import your "app.config.ts" file here.
import { gameServer } from '../src/server/index';
import { GameRoomState } from '../src/server/rooms/schema/GameRoomState';
console.log('NODE_ENV', process.env.NODE_ENV);

describe('testing your Colyseus app', () => {
  let colyseus: ColyseusTestServer;

  before(async () => (colyseus = await boot(gameServer)));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it('connecting into a room', async () => {
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom<GameRoomState>('GameRoom', {});

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room);

    // make your assertions
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

    // wait for state sync
    await room.waitForNextPatch();

    let state = room.state.toJSON();
    assert.deepStrictEqual(['cards', 'players'], Object.keys(state).sort());
    assert.deepStrictEqual(client1.sessionId, Object.keys(state.players)[0]);
  });

  it('leaving a room', async () => {
    const room = await colyseus.createRoom<GameRoomState>('GameRoom', {});

    const client1 = await colyseus.connectTo(room);
    await room.waitForNextPatch();

    let num = await client1.leave();
    console.log('num', num);
    await room.waitForNextSimulationTick();
    // await room.waitForNextPatch();

    assert.strictEqual(0, room.clients.length);

    let state = room.state.toJSON();
    assert.deepStrictEqual(['cards', 'players'], Object.keys(state).sort());
    assert.deepStrictEqual(0, Object.keys(state.players).length);
  });
});
