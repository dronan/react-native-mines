import React, { Component } from 'react';
import {StyleSheet, Text, View } from 'react-native';
import params from './src/params';
import Field from './src/components/Field';


export default class App extends Component {
  render() {
      return (
        <View style={styles.container}>
          <Text>Iniciando mines!</Text>
          <Text>Tamanho da grade: {params.getRowsAmount()}x{params.getColumnsAmount()} </Text>
          <Field />
        </View>
      )
  }
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});