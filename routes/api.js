'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  let rows = {A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8};

  app.route('/api/check')
    .post((req, res) => {
      if (!req.body.value || !req.body.puzzle || !req.body.coordinate) {
        res.json({error: 'Required field(s) missing'});
      }
      else if (!/^[1-9]$/.test(req.body.value)) {
        res.json({error: 'Invalid value'});
      }
      else if (req.body.puzzle.length != 81) {
        res.json({error: 'Expected puzzle to be 81 characters long'});
      }
      else if (!/^[1-9.]+$/.test(req.body.puzzle)) {
        res.json({error: 'Invalid characters in puzzle'});
      }
      else if (req.body.coordinate.length != 2 || !rows.hasOwnProperty(req.body.coordinate.split('')[0].toUpperCase()) || !['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(req.body.coordinate.split('')[1])) {
        res.json({error: 'Invalid coordinate'});
      }
      else {
        let puzzleArray = solver.stringToArray(req.body.puzzle);
        let row = req.body.coordinate.split('')[0].toUpperCase();
        let column = Number(req.body.coordinate.split('')[1]) - 1;
        let conflict = [];
        if (!solver.checkRowPlacement(puzzleArray, rows[row], column, req.body.value)) {
          conflict.push('row');
        }
        if (!solver.checkColPlacement(puzzleArray, rows[row], column, req.body.value)) {
          conflict.push('column');
        }
        if (!solver.checkRegionPlacement(puzzleArray, rows[row], column, req.body.value)) {
          conflict.push('region');
        }
        if (conflict.length == 0) {
          res.json({valid: true});
        }
        else {
          res.json({valid: false, conflict});
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle) {
        res.json({error: 'Required field missing'});
      }
      else if (req.body.puzzle.length != 81) {
        res.json({error: 'Expected puzzle to be 81 characters long'});
      }
      else if (!/^[1-9.]+$/.test(req.body.puzzle)) {
        res.json({error: 'Invalid characters in puzzle'});
      }
      else {
        let puzzleArray = solver.stringToArray(req.body.puzzle);
        let result = solver.solve(puzzleArray);
        if (result) {
          let solution = '';
          for (let i in result) {
            solution = solution + result[i].join('');
          }
          res.json({solution});
        }
        else {
          res.json({error: 'Puzzle cannot be solved'});
        }
      }
    });
};
