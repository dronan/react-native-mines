/**
 * Creates a board for a minesweeper game.
 *
 * @param {number} rows - The number of rows in the board.
 * @param {number} columns - The number of columns in the board.
 * @returns {Array<Array<Object>>} A 2D array representing the board, where each cell is an object with the following properties:
 * - row {number}: The row index of the cell.
 * - column {number}: The column index of the cell.
 * - opened {boolean}: Whether the cell has been opened.
 * - flagged {boolean}: Whether the cell has been flagged.
 * - mined {boolean}: Whether the cell contains a mine.
 * - exploded {boolean}: Whether the cell has exploded.
 * - nearMines {number}: The number of mines in the neighboring cells.
 */
const createBoard = (rows, columns) => {
  return Array(rows)
    .fill(0)
    .map((_, row) => {
      return Array(columns)
        .fill(0)
        .map((_, column) => {
          return {
            row,
            column,
            opened: false,
            flagged: false,
            mined: false,
            exploded: false,
            nearMines: 0,
          };
        });
    });
};

/**
 * Randomly plants a specified number of mines on a game board.
 *
 * @param {Array<Array<Object>>} board - The game board represented as a 2D array of objects.
 * @param {number} minesAmount - The number of mines to plant on the board.
 */
const spreadMines = (board, minesAmount) => {
  const rows = board.length;
  const columns = board[0].length;
  let minesPlanted = 0;

  while (minesPlanted < minesAmount) {
    const rowSel = parseInt(Math.random() * rows, 10);
    const columnSel = parseInt(Math.random() * columns, 10);

    if (!board[rowSel][columnSel].mined) {
      board[rowSel][columnSel].mined = true;
      minesPlanted++;
    }
  }
};

/**
 * Creates a board with the specified number of rows and columns, and spreads a given amount of mines on it.
 *
 * @param {number} rows - The number of rows in the board.
 * @param {number} columns - The number of columns in the board.
 * @param {number} minesAmount - The number of mines to be placed on the board.
 * @returns {Array} The generated board with mines.
 */
const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
  return board;
};

/**
 * Creates a deep copy of a 2D array representing a board.
 *
 * @param {Array<Array<Object>>} board - The board to be cloned, represented as a 2D array of objects.
 * @returns {Array<Array<Object>>} A new 2D array with cloned objects from the original board.
 */
const cloneBoard = board => {
  return board.map(rows => {
    return rows.map(field => {
      return {...field};
    });
  });
};

/**
 * Retrieves the neighboring cells of a specified cell in a 2D board.
 *
 * @param {Array<Array<any>>} board - The 2D array representing the board.
 * @param {number} row - The row index of the specified cell.
 * @param {number} column - The column index of the specified cell.
 * @returns {Array<any>} An array containing the values of the neighboring cells.
 */
const getNeighbors = (board, row, column) => {
  const neighbors = [];
  const rows = [row - 1, row, row + 1];
  const columns = [column - 1, column, column + 1];
  rows.forEach(r => {
    columns.forEach(c => {
      const different = r !== row || c !== column;
      const validRow = r >= 0 && r < board.length;
      const validColumn = c >= 0 && c < board[0].length;
      if (different && validRow && validColumn) {
        neighbors.push(board[r][c]);
      }
    });
  });
  return neighbors;
};

/**
 * Checks if all neighboring cells of a given cell in the board are safe (not mined).
 *
 * @param {Array<Array<Object>>} board - The game board represented as a 2D array of cell objects.
 * @param {number} row - The row index of the cell to check.
 * @param {number} column - The column index of the cell to check.
 * @returns {boolean} - Returns true if all neighboring cells are safe, otherwise false.
 */
const safeNeighborhood = (board, row, column) => {
  const safes = (result, neighbor) => result && !neighbor.mined;
  return getNeighbors(board, row, column).reduce(safes, true);
};

/**
 * Opens a field on the board at the specified row and column.
 * If the field is mined, it will be marked as exploded.
 * If the field is not mined and has no neighboring mines, it will recursively open all neighboring fields.
 * If the field is not mined but has neighboring mines, it will count the number of neighboring mines.
 *
 * @param {Array<Array<Object>>} board - The game board, a 2D array of field objects.
 * @param {number} row - The row index of the field to open.
 * @param {number} column - The column index of the field to open.
 */
const openField = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.opened = true;
    if (field.mined) {
      field.exploded = true;
    } else if (safeNeighborhood(board, row, column)) {
      getNeighbors(board, row, column).forEach(n =>
        openField(board, n.row, n.column),
      );
    } else {
      const neighbors = getNeighbors(board, row, column);
      field.nearMines = neighbors.filter(n => n.mined).length;
    }
  }
};

/**
 * Flattens a 2D array (board) into a 1D array.
 *
 * @param {Array<Array<any>>} board - The 2D array to be flattened.
 * @returns {Array<any>} A new 1D array containing all the elements of the input 2D array.
 */
const fields = board => [].concat(...board);

/**
 * Checks if there has been an explosion on the board.
 *
 * @param {Array} board - The game board represented as an array of fields.
 * @returns {boolean} - Returns true if any field on the board has exploded, otherwise false.
 */
const hadExplosion = board =>
  fields(board).filter(field => field.exploded).length > 0;

const pendding = field => {
  const mined = field.mined;
  const flagged = field.flagged;
  return mined && !flagged;
};

const wonGame = board => fields(board).filter(pendding).length === 0;

/**
 * Reveals all mined fields on the board by setting their 'opened' property to true.
 *
 * @param {Array} board - The game board represented as a 2D array of field objects.
 */
const showMines = board =>
  fields(board)
    .filter(field => field.mined)
    .forEach(field => (field.opened = true));

/**
 * Toggles the flagged state of a specific field on the board.
 *
 * @param {Array<Array<Object>>} board - The game board represented as a 2D array of objects.
 * @param {number} row - The row index of the field to be toggled.
 * @param {number} column - The column index of the field to be toggled.
 */
const invertFlag = (board, row, column) => {
  const field = board[row][column];
  field.flagged = !field.flagged;
};

/**
 * Counts the number of flagged fields in the given board.
 *
 * @param {Array} board - The game board represented as an array of fields.
 * @returns {number} The number of flagged fields in the board.
 */
const flagsUsed = board => fields(board).filter(field => field.flagged).length;

export {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
};
