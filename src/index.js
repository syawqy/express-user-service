const mongoose = require('mongoose');
const config = require('./config');
const app = require('./app');


let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then((response) => {
    console.log('Connected to the database...');
    server = app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
        console.log('Server closed');
        process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});