'use strict';

const supertest = require('supertest');
const {describe, test} = require('@jest/globals');

const server = require('../lib/server');
const {db} = require('../lib/models/index');

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

const request = supertest(server.app);

let token = null;

describe('testing auth routes', () => {
  test('expect status code 201 on POST /signup', async () => {
    const body = {
      username: 'foo',
      password: 'bar',
      role: 'admin',
    };

    const response = await request
        .post('/signup')
        .send(body)
        .expect(201)
        .expect('Content-Type', /json/);

    token = JSON.parse(response.text).token;
  });

  test('expect status code 200 on POST /signin', () => {
    const body = {
      username: 'foo',
      password: 'bar',
    };

    request
        .post('/signup')
        .send(body)
        .expect(200)
        .expect('Content-Type', /json/);
  });
});

describe('Testing resource routes', () => {
  test('expect status code 201 on POST to /todo', () => {
    const body = {
      text: 'foo',
      difficulty: 1,
      assignee: 'bar',
      complete: false,
    };

    request
        .post('/todo')
        .auth(token, {type: 'bearer'})
        .send(body)
        .expect(201)
        .expect('Content-Type', /json/);
  });

  test('expect status code 200 on GET to /todo', () => {
    request
        .get('/todo')
        .auth(token, {type: 'bearer'})
        .expect(200)
        .expect('Content-Type', /json/);
  });
  test('expect status code 200 on PUT to /todo', () => {
    const body = {
      text: 'fizz',
      difficulty: 1,
      assignee: 'buzz',
      complete: false,
    };

    request
        .put('/todo/1')
        .auth(token, {type: 'bearer'})
        .send(body)
        .expect(200)
        .expect('Content-Type', /json/);
  });

  test('expect status code 202 on DELETE /todo', () => {
    request
        .delete('/todo/1')
        .auth(token, {type: 'bearer'})
        .expect(202);
  });
});
