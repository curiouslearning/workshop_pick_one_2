/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

export default class Preferences extends Component {
  
  static navigationOptions = {
    title: 'Preferences',
    header: false
  };
  
  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <View>
        <Text style={{ fontSize: 42,}}>
          User Preferences
        </Text>
        <Button
          onPress={() => navigate('Main')}
          title="Curious about Learning?"
        />
        <Image
          source={require('./media/backgrounds/back01.jpg')}
          style={{
            opacity: 1,
            width: 680,
            height: 400,
          }}
        />
      </View>
    );
  }
}



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
  fontStyle: {
    fontSize: 42,
  },
});


AppRegistry.registerComponent('Preferences', () => App);
