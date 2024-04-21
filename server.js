const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const axios = require('axios');
const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());

// Определение маршрутов
app.post('/api/v1/message/send', (req, res) => {
    // Обработка полученного сообщения
    // console.log('Receiver req: ', req.hostname);
    const receivedMessage = req.body;
    // Здесь вы можете выполнить необходимую логику для обработки сообщения
    res.status(200).json({ message: 'Сообщение успешно получено ' + receivedMessage });

    axios.post('http://127.0.0.1:8080/api/v1/receive', req.body)
        .then(response => {
            console.log('Message sent to other server successfully');
        })
        .catch(error => {
            console.error('Error sending message to other server:', error);
        });
});

// Использование Swagger UI для отображения документации
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
