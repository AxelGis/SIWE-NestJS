/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { WebSocketServer } from 'ws';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { WebSocketMessageReader, WebSocketMessageWriter, } from 'vscode-ws-jsonrpc';
import { createConnection, createServerProcess, forward, } from 'vscode-ws-jsonrpc/server';
import { Message, InitializeRequest, } from 'vscode-languageserver';
const WS_PORT = 3355;
const runLSServer = () => {
    process.on('uncaughtException', function (err) {
        //console.error('Uncaught Exception: ', err.toString());
        if (err.stack) {
            //console.error(err.stack);
        }
    });
    const serverName = 'LSP';
    const app = express();
    const dir = dirname(fileURLToPath(import.meta.url));
    app.use(express.static(dir));
    const server = app.listen(WS_PORT);
    // create the web socket
    const wss = new WebSocketServer({
        noServer: true,
        perMessageDeflate: false,
    });
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (webSocket) => {
            const socket = {
                send: (content) => webSocket.send(content, (error) => {
                    if (error) {
                        throw error;
                    }
                }),
                onMessage: (cb) => webSocket.on('message', (data) => {
                    //console.log(data.toString());
                    if (data.error) {
                        console.log(data);
                        return;
                    }
                    cb(data);
                }),
                onError: (cb) => webSocket.on('error', cb),
                onClose: (cb) => webSocket.on('close', cb),
                dispose: () => webSocket.close(),
            };
            // launch the server when the web socket is opened
            if (webSocket.readyState === webSocket.OPEN) {
                launchLanguageServer(serverName, socket);
            }
            else {
                webSocket.on('open', () => {
                    launchLanguageServer(serverName, socket);
                });
            }
        });
    });
};
const launchLanguageServer = (serverName, socket) => {
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const socketConnection = createConnection(reader, writer, () => socket.dispose());
    //создаем подключение к language server через LSP
    //в консоли выглядит как "typescript-language-server --stdio"
    //питоновский сервер запускается так: "node ./node_modules/pyright/dist/pyright-langserver.js --stdio"
    const serverConnection = createServerProcess(serverName, 'typescript-language-server', ['--stdio']);
    if (serverConnection) {
        forward(socketConnection, serverConnection, (message) => {
            if (Message.isRequest(message)) {
                //console.log(`${serverName} Server received:`);
                //console.log(message);
                if (message.method === InitializeRequest.type.method) {
                    const initializeParams = message.params;
                    initializeParams.processId = process.pid;
                }
            }
            if (Message.isResponse(message)) {
                //console.log(`${serverName} Server sent:`);
                //console.log(message);
            }
            return message;
        });
    }
};
runLSServer();
