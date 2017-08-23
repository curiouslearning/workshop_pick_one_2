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
  heading:{
    fontSize : 40,
    color: 'red',
    marginTop: SCREEN_HEIGHT*0.40,
    marginLeft: SCREEN_WIDTH*0.20,
    fontWeight:'bold',
  },
  level : {
      fontWeight: 'bold',
      
  },
  starImage: {
    flex: 1,
    height: SCREEN_HEIGHT*0.4,
    width: SCREEN_WIDTH*1.09,
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
  scoreText:{
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 15,
    marginTop: 15,
    fontWeight: 'bold',
    color:'#ff4500',
  },
  targetImage:{
    height: SCREEN_HEIGHT*0.4,
    width: SCREEN_WIDTH*0.4,
  }
});

export default SymbolDigitCodingStyles;