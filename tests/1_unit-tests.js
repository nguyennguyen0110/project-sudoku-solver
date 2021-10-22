const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let validPuzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let invalidCharacter = '0AB..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
let puzzleArray = solver.stringToArray(validPuzzleString);
let failArray = solver.stringToArray('5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
let result = solver.stringToArray('135762984946381257728459613694517832812936745357824196473298561581673429269145378');
let solvedArray = solver.solve(puzzleArray);

suite('UnitTests', () => {
  test('Valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(validPuzzleString));
  });
  test('Puzzle string with invalid characters', () => {
    assert.equal(solver.validate(invalidCharacter), 'Invalid character in puzzle');
  });
  test('Puzzle string that is not 81 characters in length', () => {
    assert.equal(solver.validate(validPuzzleString + '1'), 'Expected 81 characters');
  });
  test('Valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(puzzleArray, 0, 1, 3));
  });
  test('Invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzleArray, 0, 1, 2));
  });
  test('Valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(puzzleArray, 0, 1, 3));
  });
  test('Invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzleArray, 0, 1, 9));
  });
  test('Valid region placement', () => {
    assert.isTrue(solver.checkRegionPlacement(puzzleArray, 0, 1, 3));
  });
  test('Invalid region placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzleArray, 0, 1, 6));
  });
  test('Valid puzzle strings pass the solver', () => {
    assert.isNotFalse(solvedArray);
  });
  test('Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.solve(failArray));
  });
  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.deepEqual(solvedArray, result);
  });
});
