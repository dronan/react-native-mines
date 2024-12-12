import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert } from 'react-native';
import params from './src/params';
import MineField from './src/components/MineField';
import { createMinedBoard, cloneBoard, openField, hadExplosion, wonGame, showMines, invertFlag } from './src/functions';

export default class App extends Component  {

  constructor(props: any) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(cols * rows * params.difficultLevel);
  }

  createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
    }
  }

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

  render() {
      return (
        <View style={styles.container}>
          <Text>Iniciando mines!</Text>
          <Text>Tamanho da grade: {params.getRowsAmount()}x{params.getColumnsAmount()} </Text>
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