import React from 'react';
import { StyleSheet, View } from 'react-native';
import CaixaText from '../components/CaixaText';

const PaginaSimular = () => {
  return (
    <View style={styles.container}>
      <CaixaText style={styles.text}>Welcome to Page Two</CaixaText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PaginaSimular;
