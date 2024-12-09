import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import params from '../params';

export default props => {
  const {mined, opened, nearMines} = props;

  const stylesField = [styles.field];
  if (opened) stylesField.push(styles.opened);
  if (stylesField.length === 1) stylesField.push(styles.regular);

  let color = null;
  if (nearMines > 0) {
    if (nearMines === 1) color = '#2A28D7';
    if (nearMines === 2) color = '#2B520F';
    if (nearMines > 2 && nearMines < 6) color = '#F9060A';
    if (nearMines >= 6) color = '#F221A9';
  }

  return (
    <View style={stylesField}>
      {!mined && opened && nearMines > 0 ? (
        <Text style={[styles.label, {color: color}]}>{nearMines}</Text>
      ) : (
        false
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    height: params.blockSize,
    width: params.blockSize,
    borderWidth: params.borderSize,
  },
  regular: {
    backgroundColor: '#999',
    borderLeftColor: '#CCC',
    borderTopColor: '#CCC',
    borderRightColor: '#333',
    borderBottomColor: '#333',
  },
  opened: {
    backgroundColor: '#999',
    borderColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: params.fontSize,
  },
});
