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
  ListView,
  Dimensions,
  TouchableHighlight
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import _ from 'lodash';
//import trials from './trials';
import gameUtil from './gameUtil';
import Matrix from './Matrix';
import data from './pick_one';
import styles from './styles';
import AnimatedSprite from 'react-native-animated-sprite';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const todos = [
  {name: 'One'},
  {name: 'Two'},
  {name: 'Three'},
  {name: 'Four'}
];

export default class Trial extends Component {
  
  constructor (props) {
    super(props);
     this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
      this.state = {
      dataSource : this.ds.cloneWithRows(data.trial_list[0].obj_array),
      items : data.trial_list[0].obj_array,
      target : data.trial_list[0].target_id,
      symbolOrder: [],
      showFood: false,
      monsterAnimationIndex: [0],
      thoughtTiles: {},
      isRefreshing : false,
      scale: {
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        image: screenHeight > screenWidth ? screenWidth : screenHeight,
      },

    };

    this.pressRow = this.pressRow.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.food = {
      sprite : {},
      tweenOptions: {},
      coords: {},
      size: {},
    };

     dataPairs = {};
      for (var pair in data.object_list) {
        dataPairs[data.object_list[pair].object_id] = data.object_list[pair].stimulus;
      }
     this.dataPairs = dataPairs;


 }

  static navigationOptions = {
    title: 'Trial',
    header: false
  };
    
  componentDidMount(){
    debugger;
    this._fetchData();
  }
   
  componentWillMount () {
    const trial = 0;
    this.food.sprite = gameUtil.foodSprite(trial);
    this.food.coords = this.foodStartLocation(1);
    this.food.size = this.spriteSize(this.food.sprite, 1);
    this.setState({
      trial,
      symbolOrder: gameUtil.symbols(trial),
      thoughtTiles: gameUtil.thoughtTilesForTrial(trial),
    });
  } 

  componentWillUpdate(){
    console.log("should update now");
  }

   _fetchData(){
     this.setState({ isRefreshing: true });

   }

  spriteSize (sprite, scale) {
    const scaleBy = scale * this.state.scale.image;
    return _.mapValues(sprite.size, (val) => val * scaleBy);
  }

  foodStartLocation (position) {
    // const scaleWidth = this.state.scale.screenWidth;
    // const top = 100 * this.state.scale.screenHeight;
    // const baseLeft = 320;
    const scaleWidth = 1;
    const top = 200;
    const baseLeft = 0;
    switch (position) {
      case 0:
        return {top, left: baseLeft * scaleWidth};
      case 1:
        return {top, left: (baseLeft + 200) * scaleWidth};
      case 2:
        return {top, left: (baseLeft + 400) * scaleWidth};
      case 3:
        return {top, left: (baseLeft + 600) * scaleWidth};
    }

    return {top, left: baseLeft * this.props.scale.screenWidth};
  }

  nextLevel(){
    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    const trial = this.state.trial + 1;
    this.setState({
      trial,
      dataSource : this.ds.cloneWithRows(data.trial_list[trial].obj_array),
      items : data.trial_list[trial].obj_array,
      target : data.trial_list[trial].target_id,
    });

  }

  pressRow(rowId,todo){
    console.log('Row ' + rowId + 'Pressed...');
    if (todo.obj_id == this.state.target) {
      console.log("trueeeee");
      const correctSymbol = gameUtil.correctSymbol(this.state.trial);
      const symbolOrder = gameUtil.symbols(this.state.trial);
      const showSymbols = _.map(symbolOrder, (symbol) => (
        _.isEqual(correctSymbol, symbol) ? 'BLANK' : symbol
      ));

      this.nextLevel();
      // start food fall, monster eat and celebrate

      /*this.setState({
        symbolOrder: showSymbols,
      }, () => {
        this.stateTimeout = setTimeout(() => {
          this.foodFall(signInfo.signNumber);
        }, 120 );
      });*/

    }else{

      let temp =[]
      temp = this.state.items.splice(rowId,1);
      this.setState({  
          dataSource : this.ds.cloneWithRows(this.state.items),
      });
    }
  }

  renderRow(todo, sectionId, rowId, highlightRow){
      return (
          <TouchableHighlight onPress={() => {
            this.pressRow(rowId,todo);
            highlightRow(sectionId,rowId);
          }}>
            <View style={styles.row}>
                <Text style={styles.text}>
                {todo.obj_id}
                </Text>
            </View>
          </TouchableHighlight>
        );
  }

  displayTarget(){

    return this.dataPairs[this.state.target];
    //return this.state.target;
  }

  matrixStyle () {
    //const cloudStyle = this.cloudStyle();
    return {
      width: 200,
      height: 100,
      top:  30 * 40,
      left:  40 * 40,
      position: 'absolute',
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <Image source={require('./media/backgrounds/Game_1_Background_1280.png')}
          style={styles.backgroundImage}>

      <AnimatedSprite
            sprite={this.food.sprite}
            ref={'food'}
            animationFrameIndex={[0]}
            coordinates={this.food.coords}
            size={this.food.size}
            draggable={false}
            tweenOptions={this.state.tweenOptions}
            tweenStart={'fromMethod'}
            onTweenFinish={() => this.onFoodTweenFinish()}
          />
          
      <View>
        <Button
          onPress={() => navigate('Main')}
          title="Main Menu"
        />
        <Text style={styles.target}>
          {this.displayTarget()}
        </Text>
        <Matrix
          styles={this.matrixStyle()}
          tileScale={0.25}
          tiles={this.state.thoughtTiles}
          scale={this.state.scale}
        />
        <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
        />

      </View>
      </Image>

    );
  }
}

function thoughtTilesForTrial () {
  
}

Trial.propTypes = {
scale: React.PropTypes.object,
};

AppRegistry.registerComponent('Preferences', () => App);
