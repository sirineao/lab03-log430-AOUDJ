import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API magasin',
    version: '1.0.0',
    description: 'Documentation de l\'API pour la gestion des produits, ventes, magasins, logistique et rapports.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  security: [{
    bearerAuth: [],
  }],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
