const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const axios = require('axios');

const app = express();
const swaggerDocument = YAML.load('./WebSocket swagger.yml');

app.use(express.json());

app.post('/api/v1/receive', (req, res) => {
    console.log('Received message:', req.body);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body));
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

    console.log(`WebSocket Client Connected (${username})`);

    if (!username) {
        console.error("Username is missing");
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

        axios.post('http://127.0.0.1:8081/api/v1/message/send', req)
            .then(response => {
                console.log(`Message sent to other server successfully (${ws.username}): ${message.toString()}`);
            })
            .catch(error => {
                console.error(`Error sending message to other server (${ws.username}): ${error}`);
            });
    });

    ws.on('close', () => {
        console.log(`WebSocket Client Disconnected (${ws.username})`);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
