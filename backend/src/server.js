// This file starts the server and listens(opens) on the specified port ( “Turn ON the backend.” )
require('dotenv').config();
const app = require('./app');
const http = require('http');
const { init } = require('./services/socket');

let port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = init(server);

server.listen(port, () => {
    console.log(`app listening on ${port}`);
});

module.exports = { server, io };


