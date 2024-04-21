const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const swaggerDocument = YAML.load('./WebSocket swagger.yml');

app.use(express.json());

// Определение маршрутов
app.post('/api/v1/receive', (req, res) => {
    // Обработка полученного сообщения
    const receivedMessage = req.body;
    // Здесь вы можете выполнить необходимую логику для обработки сообщения
    console.log('Received message:', receivedMessage);
    res.status(200).json({ message: 'Сообщение успешно получено' });
});

// Использование Swagger UI для отображения документации
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket Client Connected');

    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);
        // Обработка сообщения от клиента
    });

    ws.on('close', () => {
        console.log('WebSocket Client Disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
