import React from 'react';
import {StyleSheet, View} from 'react-native';
import params from '../params';

export default props => {
  const stylesField = [styles.field];
  if (stylesField.length === 1) stylesField.push(styles.regular);

  return <View style={stylesField}></View>;
};

const styles = StyleSheet.create({
  field: {
    height: params.blockSize,
    width: params.blockSize,
    borderWidth: params.borderSize,
  },
  regular: {
    backgroundColor: '#999',
    borderLeftColor: '#ccc',
    borderTopColor: '#ccc',
    borderRightColor: '#333',
    borderBottomColor: '#333',
  },
});
