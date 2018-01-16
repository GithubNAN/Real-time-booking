const path = require('path');
const express = require('express');
const morgan = require('morgan')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(morgan('tiny'))


//Handle routes
require('./routers')(app);
//Handle socket io connection
require('./services').socket(io);

// Server listening instead app listening
server.listen(10086, () => console.log('Port listening at 10086'));
