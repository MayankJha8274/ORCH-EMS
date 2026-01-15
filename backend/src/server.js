// This file starts the server and listens(opens) on the specified port ( “Turn ON the backend.” )
require('dotenv').config();
const app = require('./app');

let port = process.env.PORT || 5000;


app.listen( port , () => {
    console.log(`app listining on the ${port}`) ;
});


