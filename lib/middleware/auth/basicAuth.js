/* eslint-disable require-jsdoc */
'use strict';

const base64 = require('base-64');
const {users} = require('../../models/index');

function _authError(res) {
  res.status(403).send('Invalid login');
}
async function basicAuth(req, res, next) {
  if (!req.headers.authorization) {
    console.error('error, no auth headers');
    _authError(res);
  };

  const basic = req.headers.authorization.split(' ').pop();
  const [username, password] = base64.decode(basic).split(':');

  try {
    req.user = await users.authenticateBasic(username, password);
    next();
  } catch (e) {
    console.error('error, something with my func');
    _authError(res);
  };
}

module.exports = basicAuth;
