import React, { Component } from 'react';
import {StyleSheet, View, Alert } from 'react-native';
import params from './src/params';
import MineField from './src/components/MineField';
import { createMinedBoard, cloneBoard, openField, hadExplosion, wonGame, showMines, invertFlag, flagsUsed } from './src/functions';
import Header from './src/components/Header';
import LevelSelection from './src/screens/LevelSelection';

export default class App extends Component  {

  constructor(props: any) {
    super(props)
    this.state = this.createState()
  }

  /**
   * Calculates the total number of mines based on the grid dimensions and difficulty level.
   *
   * @returns {number} The total number of mines.
   */
  minesAmount = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(cols * rows * params.difficultLevel);
  }

  /**
   * Creates the initial state for the game.
   *
   * @returns {Object} The initial state object containing:
   * - `board`: The game board with mines.
   * - `won`: A boolean indicating if the game is won.
   * - `lost`: A boolean indicating if the game is lost.
   * - `showLevelSelection`: A boolean indicating if the level selection should be shown.
   */
  createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    }
  }

  /**
   * Handles the event of opening a field on the game board.
   * 
   * This function clones the current game board, opens the specified field,
   * and checks if the game is lost or won. If the game is lost, it reveals all mines
   * and shows a losing alert. If the game is won, it shows a winning alert.
   * Finally, it updates the state with the new board and game status.
   * 
   * @param row - The row index of the field to open.
   * @param column - The column index of the field to open.
   */
  onOpenField = (row: number, column: number) => {
    // @ts-ignore
    const board = cloneBoard(this.state.board);
    openField(board, row, column);
    const lost = hadExplosion(board);
    const won = wonGame(board);

    if (lost) {
      showMines(board);
      Alert.alert('Perdeu!', 'Você perdeu!');
    }

    if (won) {
      Alert.alert('Parabéns', 'Você venceu!');
    }

    this.setState({ board, lost, won });
  }

  /**
   * Handles the selection of a field in the game board.
   *
   * @param {number} row - The row index of the selected field.
   * @param {number} column - The column index of the selected field.
   *
   * This function clones the current game board, inverts the flag at the specified
   * field, and checks if the game has been won. If the game is won, it displays an
   * alert to the user. Finally, it updates the component's state with the new board
   * and the game status.
   */
  onSelectField = (row:number, column:number) => {
    // @ts-ignore
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Parabéns', 'Você Venceu!')
    }

    this.setState({ board, won })
  }

  /**
   * Handles the cancellation of an action by updating the state to hide the level selection.
   * Sets the `showLevelSelection` state to `false`.
   */
  onCancel = () => {
    this.setState({showLevelSelection: false})
  }

  /**
   * Handles the flag press event by updating the component's state to show the level selection.
   *
   * @returns {void}
   */
  onFlagPress = () => {
    this.setState({showLevelSelection: true})
  }

  /**
   * Handles the selection of a difficulty level.
   *
   * @param {number} level - The selected difficulty level.
   */
  onLevelSelected = (level: number) => {
    params.difficultLevel = level
    this.setState(this.createState())
  }

  render() {
      return (
        <View style={styles.container}>
          <LevelSelection
              //@ts-ignore
              isVisible={this.state.showLevelSelection}
              onLevelSelected={this.onLevelSelected}
              onCancel={this.onCancel}
            />
          <Header
            //@ts-ignore
            flagsLeft={this.minesAmount() - flagsUsed(this.state.board)}
            onNewGame={() => this.setState(this.createState())}
            onFlagPress={this.onFlagPress}
          />
          <View style={styles.board}>
            <MineField 
              //@ts-ignore
              board={this.state.board}
              onOpenField={this.onOpenField}
              onSelectField={this.onSelectField}
            />
          </View>
        </View>
      )
  }
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA',
  }
});