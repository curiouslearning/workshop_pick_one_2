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

import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';

import _ from 'lodash';
//import trials from './trials';
import AnimatedSprite from 'react-native-animated-sprite';
import monsterSprite from './sprites/monster/monsterSprite';
import gameIcon from "./media/gameIcon/gameIcon";
import gameUtil from './gameUtil';
import Matrix from './Matrix';
import data from './pick_one';
import styles from './styles';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const todos = [
  {name: 'One'},
  {name: 'Two'},
  {name: 'Three'},
  {name: 'Four'}
];

var totalScore = 0;

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
      score : data.trial_list[0].obj_array.length,
      scale: {
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        image: screenHeight > screenWidth ? screenWidth : screenHeight,
      },
    };

    totalScore = this.state.items.length;
    this.pressRow = this.pressRow.bind(this);
    this.renderRow = this.renderRow.bind(this);

     dataPairs = {};
      for (var pair in data.object_list) {
        dataPairs[data.object_list[pair].object_id] = data.object_list[pair].stimulus;
      }
     this.dataPairs = dataPairs;

     const iconList = [
      {
        name: 'BUBBLE',
        imgSrc: require('./media/gameIcon/game2_icon_color.png'),
        location: {top: 430, left: 100},
        frameIndex: [11],
      },
      {
        name: 'BUBBLE22',
        imgSrc: require('./media/gameIcon/game6_icon_color.png'),
        location: {top: 530, left: 200},
        frameIndex: [10],
      },
    ];

    this.iconList = _.shuffle(iconList);
    this.gameIcon = {tweenOptions: {}};
    this.iconAppearTimeout = [];
    this.iconRefs = [];

    this.popSound;
    this.popPlaying = false;
    this.celebrateSound;
    this.celebratePlaying = false;
    this.initIcons();
 }

 
  static navigationOptions = {
    title: 'Trial',
    header: false
  };

  showTween(){
    _.forEach(this.iconList, (icon, index) => {
      const timeout = setTimeout(() => {
        debugger;
        let iconRef = this.refs[this.iconRefs[index]];
        iconRef.startTween();
      }, 10);
      this.iconAppearTimeout.push(timeout);
    });
  }
    
  componentDidMount(){
    debugger;
    this._fetchData();
    this.initSounds();
  }
   
  componentWillMount () {
    const trial = 0;
    this.setState({
      trial,
      symbolOrder: gameUtil.symbols(trial),
      thoughtTiles: gameUtil.thoughtTilesForTrial(trial),
    });
  } 

  componentWillUpdate(){
  }

  componentWillUnmount () {
    this.releaseSounds();
  }

   _fetchData(){
     this.setState({ isRefreshing: true });
   }

   initSounds () {
   
    this.popSound = new Sound('tada.mp3', '', (error) => {
      if (error) {
        console.warn('failed to loaddddd the sound', error);
        return;
      }
      this.popSound.setSpeed(1);
      this.popSound.setNumberOfLoops(0);
      this.popSound.setVolume(1);
    });
   
    this.celebrateSound = new Sound('celebrate.mp3', '', (error) => {
      if (error) {
        console.warn('failed to loaddddd the sound', error);
        return;
      }
      this.celebrateSound.setSpeed(1);
      this.celebrateSound.setNumberOfLoops(0);
      this.celebrateSound.setVolume(1);
    });
    
  }

  releaseSounds () {
    this.popSound.stop();
    this.popSound.release();
    this.celebrateSound.stop();
    this.celebrateSound.release();
  }

  nextLevel(){
    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    const trial = this.state.trial + 1;
    totalScore += 10;
    this.setState({
      trial,
      dataSource : this.ds.cloneWithRows(data.trial_list[trial].obj_array),
      items : data.trial_list[trial].obj_array,
      target : data.trial_list[trial].target_id,
      score : data.trial_list[trial].obj_array.length,
    });

  }

  pressRow(rowId,todo){
    console.log('totalScore ' + totalScore + 'Pressed...');
    
    if (todo.obj_id == this.state.target) {
      if (!this.popPlaying) {
      this.popPlaying = true;
      this.popSound.play(() => {this.popPlaying = false;});
      }
      if (!this.celebratePlaying) {
      this.celebratePlaying = true;
      this.celebrateSound.play(() => {this.celebratePlaying = false;});
      }
      const correctSymbol = gameUtil.correctSymbol(this.state.trial);
      const symbolOrder = gameUtil.symbols(this.state.trial);
      const showSymbols = _.map(symbolOrder, (symbol) => (
        _.isEqual(correctSymbol, symbol) ? 'BLANK' : symbol
      ));
      this.nextLevel();
    }else{
      //this.showTween();
      let temp =[]
      temp = this.state.items.splice(rowId,1);
      this.setState({  
          dataSource : this.ds.cloneWithRows(this.state.items),
      });
    }
    this.setState({
      score : this.state.items.length,
    });
    console.log('Score ' + this.state.score + 'Pressed...');

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
  }

  startSize () {
    return ({
      width: 240 * 0.3,
      height: 240 * 0.3,
    });
  }

  makeZoomTween (startScale=0.01, endScale= 1, duration=1000) {
    if (startScale == 0) {
      startScale = 0.01;
    }
    else if (endScale == 0) {
      endScale == 0.01;
    }
    return ({
      tweenType: "zoom-into-existence",
      startScale: startScale,
      startOpacity: 0,
      endScale: endScale,
      duration: duration,
      loop: false,
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Image source={require('./media/backgrounds/Game_1_Background_1280.png')}
          style={styles.backgroundImage}>
      <View>
        <Button
          onPress={() => navigate('Main')}
          title="Main Menu"
        />
        <Text style={styles.target}>
          {this.displayTarget()}
        </Text>
        <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
        />      
      </View>
      {this.icons}
      </Image>

    );
  }


  initIcons () {
    this.icons = _.map(this.iconList, (icon, index) => {
      const ref = ("gameRef" + index);
      debugger;
      this.iconRefs.push(ref);
      console.log("REFS = ", ref);
      return (<AnimatedSprite
        key={index}
        ref={ref}
        sprite={gameIcon}
        animationFrameIndex={icon.frameIndex}
        loopAnimation={true}
        coordinates={{top:icon.location.top, left: icon.location.left}}
        size={this.startSize()}
        draggable={true}
        scale={0.1}
        opacity={0}
        tweenOptions = {this.makeZoomTween(0.1, 1, 1000)}
        tweenStart={'fromMethod'}
      />);
    });
  }


}

function thoughtTilesForTrial () {
  
}

Trial.propTypes = {
scale: React.PropTypes.object,
};

AppRegistry.registerComponent('Preferences', () => App);
