const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const passport = require('passport');
const { jwtStrategy } = require('./config.passport');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

const userRouter = require('./routes/user.routes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());

app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello world!"});
});

app.use('/users', userRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;