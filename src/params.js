import {Dimensions} from 'react-native';

/**
 * Configuration parameters for the game.
 * @namespace params
 * @property {number} blockSize - The size of each block in the game grid.
 * @property {number} borderSize - The size of the border around each block.
 * @property {number} fontSize - The font size used in the game.
 * @property {number} headerRatio - The ratio of the screen height used for the header.
 * @property {number} difficultLevel - The difficulty level of the game.
 * @property {function} getColumnsAmount - Calculates the number of columns based on the screen width.
 * @property {function} getRowsAmount - Calculates the number of rows based on the screen height.
 */
const params = {
  blockSize: 30,
  borderSize: 5,
  fontSize: 15,
  headerRatio: 0.15, // 15% of the screen height
  difficultLevel: 0.1,
  getColumnsAmount() {
    const width = Dimensions.get('window').width;
    return Math.floor(width / this.blockSize); // round down to avoid screen overflow
  },
  getRowsAmount() {
    const totalHeight = Dimensions.get('window').height;
    const boardHeight = totalHeight * (1 - this.headerRatio);
    return Math.floor(boardHeight / this.blockSize); // round down to avoid screen overflow
  },
};

export default params;
