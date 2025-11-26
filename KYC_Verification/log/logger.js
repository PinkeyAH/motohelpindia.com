const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Get the current date in YYYY-MM-DD format
const getDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),

    transports: [
        new transports.Console(),
        new transports.File({ filename: `log/logs/server-${getDate()}.log` })
    ]
});

module.exports = logger;

