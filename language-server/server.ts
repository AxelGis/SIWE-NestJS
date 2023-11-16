import { WebSocketServer } from 'ws';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { Server } from 'http';
import {
  IWebSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from 'vscode-ws-jsonrpc';
import {
  createConnection,
  createServerProcess,
  forward,
} from 'vscode-ws-jsonrpc/server';
import {
  Message,
  InitializeRequest,
  InitializeParams,
} from 'vscode-languageserver';

const WS_PORT = 3355;

const runLSServer = () => {
  process.on('uncaughtException', function (err: any) {
    console.error('Uncaught Exception: ', err.toString());
    if (err.stack) {
      console.error(err.stack);
    }
  });

  const serverName = 'LSP';

  const app = express();
  const dir = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(dir));
  const server: Server = app.listen(WS_PORT);

  // create the web socket
  const wss = new WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
  });

  server.on(
    'upgrade',
    (request: IncomingMessage, socket: Socket, head: Buffer) => {
      wss.handleUpgrade(request, socket, head, (webSocket) => {
        const socket: IWebSocket = {
          send: (content) =>
            webSocket.send(content, (error) => {
              if (error) {
                throw error;
              }
            }),
          onMessage: (cb) =>
            webSocket.on('message', (data) => {
              const json = JSON.parse(data.toString());

              // this error crashes language server
              // code: -32601
              // message: 'Unhandled method window/workDoneProgress/create

              if (json.error && json.error.code === -32601) {
                console.log(json.error);
              } else {
                console.log(data.toString());
                cb(data);
              }
            }),
          onError: (cb) => webSocket.on('error', cb),
          onClose: (cb) => webSocket.on('close', cb),
          dispose: () => webSocket.close(),
        };
        // launch the server when the web socket is opened
        if (webSocket.readyState === webSocket.OPEN) {
          launchLanguageServer(serverName, socket);
        } else {
          webSocket.on('open', () => {
            launchLanguageServer(serverName, socket);
          });
        }
      });
    },
  );
};

const launchLanguageServer = (serverName: string, socket: IWebSocket) => {
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const socketConnection = createConnection(reader, writer, () =>
    socket.dispose(),
  );

  //создаем подключение к language server через LSP
  //в консоли выглядит как "typescript-language-server --stdio"
  //питоновский сервер запускается так: "node ./node_modules/pyright/dist/pyright-langserver.js --stdio"
  const serverConnection = createServerProcess(
    serverName,
    'typescript-language-server',
    ['--stdio'],
  );
  if (serverConnection) {
    forward(socketConnection, serverConnection, (message) => {
      if (Message.isRequest(message)) {
        console.log(`${serverName} Server received:`);
        console.log(message);
        if (message.method === InitializeRequest.type.method) {
          const initializeParams = message.params as InitializeParams;
          initializeParams.processId = process.pid;
        }
      }
      if (Message.isResponse(message)) {
        console.log(`${serverName} Server sent:`);
        console.log(message);
      }
      return message;
    });
  }
};

runLSServer();
