const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const docs = require('./docs');

require('dotenv').config();

const {createPool} = require('./utils/controller-utils');

// constants
const PORT = process.env.PORT || 5000;
const ROUTES = {
    USER: require('./routes/user'),
    SONG: require('./routes/song'),
    PLAYLIST: require('./routes/playlist'),
};

// init app
const app = express();

// parse middlewares
app.use(express.json());
app.use(cors());

// mysql
createPool().getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected to database as ${connection.threadId}`);
});

// routers
app.get('', (req, res) => {
    res.send('Hello, friend!');
});

app.use('/user', ROUTES.USER);
app.use('/song', ROUTES.SONG);
app.use('/playlist', ROUTES.PLAYLIST);

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

app.listen(PORT, () => console.log(`listening on port ${PORT} ...`));
