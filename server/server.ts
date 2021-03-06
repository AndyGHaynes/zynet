import * as http from 'http';
import * as WebSocket from 'ws';

import ZynetMessage from '../core/models/ZynetMessage';
import { ZynetMessageType } from '../core/constants';

const clientWebsocketPort = 8081;
const server = http.createServer();

const websocketServer = new WebSocket.Server({ server });
websocketServer.on('connection', (websocket: WebSocket) => {
  websocket.on('message', (data: string) => {
    const broadcast = (msg: ZynetMessage) => {
      websocketServer.clients
        .forEach((client: WebSocket) => client !== websocket && client.send(JSON.stringify(msg)));
    };

    const message = <ZynetMessage>JSON.parse(data);
    switch (message.type) {
      case ZynetMessageType.LogUpdate:
      case ZynetMessageType.UpdateConfig:
        broadcast(message);
        break;
      default:
    }
  });

  websocket.on('error', (err: Error) => {
    console.error(err);
  });
});

server.listen(clientWebsocketPort, () => {
  console.log(`client websocket listening on port ${clientWebsocketPort}`);
});

export default server;
