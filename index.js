'use strict';

const server = require('./lib/server');
const {db} = require('./lib/models/index');

const PORT = process.env.PORT || 3000;

db.sync();
server.start(PORT);
