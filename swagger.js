const swaggerAutogen = require('swagger-autogen')();
const config = require('./src/config');
const port = config.env == "production" ? "" : ":"+config.port;

const doc = {
  info: {
    title: 'User API',
    description: 'User CRUD and login API using JWT',
  },
  host: `${config.host}${port}`,
  schemes: ['http'],
  security: [ { bearerAuth: [] } ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      description: "Value: Bearer ",
      in: "header",
      scheme: 'bearer'
  }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/index');
});