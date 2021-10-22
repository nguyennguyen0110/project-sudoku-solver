const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let invalidCharacter = '0AB..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let failPuzzle = '5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let result = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Functional Tests', function() {
  this.timeout(5000);
  test('Solve a puzzle with valid puzzle string', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: validPuzzleString})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, result);
        done();
      });
  });
  test('Solve a puzzle with missing puzzle string', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: ''})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });
  test('Solve a puzzle with invalid characters', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: invalidCharacter})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  test('Solve a puzzle with incorrect length', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: validPuzzleString + '1'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  test('Solve a puzzle that cannot be solved', done => {
    chai.request(server)
      .post('/api/solve')
      .send({puzzle: failPuzzle})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });
  
  test('Check a puzzle placement with all fields', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString, coordinate: 'A2', value: '3'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
  });
  test('Check a puzzle placement with single placement conflict', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString, coordinate: 'A2', value: '8'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.deepEqual(res.body.conflict, ['row']);
        done();
      });
  });
  test('Check a puzzle placement with multiple placement conflicts', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString, coordinate: 'A2', value: '6'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.deepEqual(res.body.conflict, ['column', 'region']);
        done();
      });
  });
  test('Check a puzzle placement with all placement conflicts', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString, coordinate: 'A2', value: '2'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });
  test('Check a puzzle placement with missing required fields', done => {
    chai.request(server)
      .post('/api/check')
      .send({coordinate: 'A2', value: '2'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });
  test('Check a puzzle placement with invalid characters', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: invalidCharacter, coordinate: 'A2', value: '3'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  test('Check a puzzle placement with incorrect length', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString + '1', coordinate: 'A2', value: '3'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  test('Check a puzzle placement with invalid placement coordinate', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString, coordinate: 'A20', value: '3'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });
  test('Check a puzzle placement with invalid placement value', done => {
    chai.request(server)
      .post('/api/check')
      .send({puzzle: validPuzzleString, coordinate: 'A2', value: '30'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});

