const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const axios = require('axios');
const logger = require("./utils/logger");

const app = express();
const swaggerDocument = YAML.load('./WebSocket swagger.yml');

app.use(express.json());

app.post('/api/v1/receive', (req, res) => {
    logger('Received message:', JSON.stringify(req.body));
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if (req.body.error) {
                if (req.body.username === client.username) {
                    client.send(JSON.stringify(req.body));
                    logger("ERROR MESSAGE SENT TO THE AUTHOR", JSON.stringify(req.body));
                }
            } else {
                client.send(JSON.stringify(req.body));
                logger("MESSAGE SENT TO AlL USERS", JSON.stringify(req.body));
            }
        }
    });



    res.status(200).json({ message: 'Сообщение успешно получено' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws/send' });

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const username = urlParams.get('username');

    logger(`WebSocket Client Connected (${username})`);

    if (!username) {
        logger("ERROR", "Username is missing");
        ws.close();
        return;
    }

    ws.username = username;

    ws.on('message', (message) => {
        const req = {
            "username": username,
            "content": message.toString(),
            "time": Date.now()
        }

        axios.post('http://127.0.0.1:5500/api/v1/message/send', req)
            .then(response => {
                logger(`Message sent to other server successfully (${ws.username}): ${message.toString()}`);
            })
            .catch(error => {
                logger(`Error sending message to other server (${ws.username}): ${error}`);
            });
    });

    ws.on('close', () => {
        logger(`WebSocket Client Disconnected (${ws.username})`);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    logger(`Сервер запущен на порту ${PORT}`);
});
