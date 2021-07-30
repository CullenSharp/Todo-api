'use strict';

const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// import tables
const {todoItems} = require('./models/index');
const {users} = require('./models/index');

// middleware
const basicAuth = require('../lib/middleware/auth/basicAuth');
const bearerAuth = require('../lib/middleware/auth/bearerAuth');
const acl = require('../lib/middleware/auth/acl');

// resource routes

app.get('/todo', bearerAuth, acl('read'), async (req, res) => {
  const toDos = todoItems.findAll({});
  res.status(200).json(toDos);
});

app.post('/todo', bearerAuth, acl('create'), async (req, res) => {
  const newItem = await todoItems.create(req.body);
  res.status(201).json(newItem);
});

app.put('/todo/:id', bearerAuth, acl('update'), async (req, res) => {
  const options = {where: {id: req.params.id}};
  const modifiedItem = await todoItems.update(req.body, options);
  res.status(204).json(modifiedItem);
});

app.delete('/todo/:id', bearerAuth, acl('delete'), async (req, res) => {
  const options = {where: {id: req.params.id}};
  await todoItems.destroy(options);
  res.status(202);
});

// auth routes
app.post('/signup', async (req, res) => {
  const newUser = await users.create(req.body);
  res.status(201).json(newUser);
});

app.post('/signin', basicAuth, async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

module.exports = {
  app: app,
  start: function(PORT) {
    app.listen(PORT, console.log(`Listening on ${PORT}`));
  },
};
