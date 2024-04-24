const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const axios = require('axios');
const logger = require("./utils/logger");
const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());

app.post('/api/v1/message/send', (req, res) => {
    const receivedMessage = JSON.parse(JSON.stringify(req.body));

    res.status(200).json({ message: 'Сообщение успешно получено ' + receivedMessage });

    receivedMessage.error = Math.random() <= 0.5;

    logger(JSON.stringify(receivedMessage));
    axios.post('http://127.0.0.1:8080/api/v1/receive', receivedMessage)
        .then(response => {
            logger('Message sent to other server successfully');
        })
        .catch(error => {
            logger("ERROR", `Error sending message to other server: ${error}`);
        });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    logger(`Сервер запущен на порту ${PORT}`);
});
