/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import generateOTP from './lib/totp.js';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const TotpHat = React.createClass({
  getInitialState() {
    return {
      generators: [
        {
          name: 'Gmail <js-ios@gmail.com>',
          secret: 'abcdefghijklmnop'
        }
      ]
    }
  },

  componentDidMount(){
    var updateInterval = setInterval( () =>{
      this.forceUpdate();
    }, 1000);
  },

  renderGenerator(generator) {
    const { otp, secondsBeforeExpiration } = generateOTP(generator)
    // `otp` is the One Time Password, that is the code to be used as a second factor
    // `secondsBeforeExpiration` is an integer representation of how much longer (in seconds) the otp is valid

    return (
      <View key={generator.name}>
        <Text>{ generator.name } | { otp } | { secondsBeforeExpiration }</Text>
      </View>
    )
  },

  render() {
    return (
      <View style={styles.container}>
        { this.state.generators.map(this.renderGenerator) }
      </View>
    )
  },

})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('TotpHat', () => TotpHat);
