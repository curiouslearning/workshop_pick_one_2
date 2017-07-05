import {
  StyleSheet,
} from 'react-native';

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;

const SymbolDigitCodingStyles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  backgroundImage: {
    flex: 1,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
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
  row:{
    flexDirection: 'row',
    justifyContent: 'center',
    padding:12,
    backgroundColor: '#f6f6f6',
    marginBottom: 3
  },
  text:{

  }, 
  target:{
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 15,
    marginTop: 15,
    backgroundColor: '#ee7474',
  },
});

export default SymbolDigitCodingStyles;