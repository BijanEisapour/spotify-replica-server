const server = require('./server');
const swaggerUi = require('swagger-ui-express');
const docs = require('./docs');

const PORT = process.env.PORT || 5000;

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));
server.listen(PORT, () => console.log(`listening on port ${PORT} ...`));
