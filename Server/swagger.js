const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookMyShow API',
      version: '1.0.0',
      description: 'Documentation for BookMyShow backend'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  // Restrict scanning to source files to avoid EISDIR/node_modules
  apis: [
    `${__dirname}/routes/*.js`,
    `${__dirname}/controllers/*.js`,
    `${__dirname}/models/*.js`
  ]
};

const swaggerSpec = swaggerJSDoc(options);

// Serve swagger UI and use a small custom CSS
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: '/swagger.css'
}));

// Expose raw OpenAPI spec for clients/CI
router.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = router;