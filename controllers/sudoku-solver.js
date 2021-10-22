class SudokuSolver {

  //IMPORTANT: ALWAYS CREATE constructor() METHOD ***********************************************
  constructor() {}
  
  //This method validate() just use for the tests
  //I validated puzzle string in api.js already
  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return 'Expected 81 characters';
    }
    else if (!/^[1-9.]+$/.test(puzzleString)) {
      return 'Invalid character in puzzle';
    }
    else {
      return true;
    }
  }

  /*  Convert string to array
  [
    [0,1,2,3,4,5,6,7,8],
    [0,1,2,3,4,5,6,7,8],
    ...
    [0,1,2,3,4,5,6,7,8]
  ]                                   */
  stringToArray(puzzleString) {
    let puzzleArray = [];
    puzzleArray.push(puzzleString.slice(0,9).split(''));
    puzzleArray.push(puzzleString.slice(9,18).split(''));
    puzzleArray.push(puzzleString.slice(18,27).split(''));
    puzzleArray.push(puzzleString.slice(27,36).split(''));
    puzzleArray.push(puzzleString.slice(36,45).split(''));
    puzzleArray.push(puzzleString.slice(45,54).split(''));
    puzzleArray.push(puzzleString.slice(54,63).split(''));
    puzzleArray.push(puzzleString.slice(63,72).split(''));
    puzzleArray.push(puzzleString.slice(72).split(''));
    return puzzleArray;
  }

  checkRowPlacement(puzzleArray, row, column, value) {
    //Loop through the row
    for (let i = 0; i < 9; i++) {
      //Skip checking itself (in case there is already value in the position)
      if (i == column) {
        continue;
      }
      //If value already in other position then it false
      if (puzzleArray[row][i] == value) {
        return false;
      }
    }
    //If nowhere in the row has that value, then true
    return true;
  }

  checkColPlacement(puzzleArray, row, column, value) {
    //Loop through the column
    for (let i = 0; i < 9; i++) {
      //Skip checking itself (in case there is already value in the position)
      if (i == row) {
        continue;
      }
      //If value already in other position then it false
      if (puzzleArray[i][column] == value) {
        return false;
      }
    }
    //If nowhere in the column has that value, then true
    return true;
  }

  checkRegionPlacement(puzzleArray, row, column, value) {
    //Get the start position of the region where we checking value
    let startRow = Math.floor(row / 3) * 3;
    let startColumn = Math.floor(column / 3) * 3;
    //Loop through the region
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startColumn; c < startColumn + 3; c++) {
        //Skip checking itself (in case there is already value in the position)
        if (r == row && c == column) {
          continue;
        }
        //If value already in other position then it false
        if (puzzleArray[r][c] == value) {
          return false;
        }
      }
    }
    //If nowhere in the region has that value, then true
    return true;
  }

  /*
    If input don't have value '.', this method return true
    else this method will try to add value from 1 => 9
      if all the positions can take a valid value, then return solved puzzle
      else this method return false
  */
  solve(puzzleArray) {
    //Loop through every position in puzzle
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        //If position has value '.'
        if (puzzleArray[row][column] == '.') {
          //Try add value from 1 => 9
          for (let val of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
            //If the trying value is valid
            if (this.checkRowPlacement(puzzleArray, row, column, val) && this.checkColPlacement(puzzleArray, row, column, val) && this.checkRegionPlacement(puzzleArray, row, column, val)) {
              //then add value to that position
              puzzleArray[row][column] = val;
              //Recursion with the new puzzle object
              //***Note that recursion function in condition state
              if (this.solve(puzzleArray)) {
                //Return puzzleObject if recursion function return true
                //which means puzzle is solved (no position has value '.')
                return puzzleArray;
              }
            }
          }
          //If all the value from 1 => 9 not valid, then get back the value '.'
          puzzleArray[row][column] = '.';
          //Return false to the 'if (this.solve(puzzleObject))' of the last step
          //(so the loop continue to try next value from 1 => 9)
          return false;
        }
      }
    }
    //If no position has value '.' means puzzle is solved then return true
    //to the 'if (this.solve(puzzleObject))' and execute 'return puzzleObject;'
    return true;
  }

}

module.exports = SudokuSolver;

