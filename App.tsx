import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

interface AppState {}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    // You can initialize state here if needed
    this.test = this.test.bind(this);
  }

  test() {
    console.log("test");
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Hello World!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
