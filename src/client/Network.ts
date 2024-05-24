import { Client } from 'colyseus.js';

export class Network {
  static client: Client;

  static connect() {
    let isSecure = window.location.protocol === 'https:' ? true : false;
    let url;
    if (isSecure) url = `wss://${window.location.hostname}`;
    else url = `ws://${window.location.hostname}:8000`;

    this.client = new Client(url);
  }
}
