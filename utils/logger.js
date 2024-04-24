const logger = function (...values) {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    console.log(`[${hours}:${minutes}:${seconds}:${milliseconds}] | ` + [...values].join(' | '));
}

module.exports = logger;