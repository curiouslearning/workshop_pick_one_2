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
import AnimatedSprite from 'react-native-animated-sprite';
import monsterSprite from './sprites/monster/monsterSprite';
import gameIcon from "../media/gameIcon/gameIcon";
import gameUtil from './gameUtil';
import Matrix from './Matrix';
import originalData from '../json/pick_one';
import styles from '../style/styles';
import curious from './CuriousLearningDataAPI';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const todos = [
  {name: 'One'},
  {name: 'Two'},
  {name: 'Three'},
  {name: 'Four'}
];

var totalScore = 0;
var totalScoreScored= 0;
var totalLevels = 0; 
var gameEnded = false;
var data;

export default class PickOne extends Component { 
  constructor (props) {
    super(props);
    data = originalData;
     this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
      this.state = {
      dataSource : this.ds.cloneWithRows(data.trial_list[0].obj_array),
      allOptions : data.trial_list[0].obj_array.slice(),
      items : data.trial_list[0].obj_array.slice(),
      target : data.trial_list[0].target_id,
      level : data.trial_list[0].level_id,
      startTimeStamp : new Date(),
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

    totalScoreScored = 0;
    totalLevels = data.trial_list.length;
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
        imgSrc: require('../media/gameIcon/game2_icon_color.png'),
        location: {top: 430, left: 100},
        frameIndex: [11],
      },
      {
        name: 'BUBBLE22',
        imgSrc: require('../media/gameIcon/game6_icon_color.png'),
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
    title: 'PickOne',
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
   
    this.popSound = new Sound('tadaa.mp3', '', (error) => {
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
    totalScoreScored += this.state.score;
    if(totalLevels == trial){
        console.log("ended");
        gameEnded = true;
        this.setState({
        trial,
      });

    }
    else{
      totalScore += data.trial_list[trial].obj_array.length;
      this.setState({
        trial,
        dataSource : this.ds.cloneWithRows(data.trial_list[trial].obj_array),
        allOptions : data.trial_list[trial].obj_array.slice(),
        items : data.trial_list[trial].obj_array.slice(),
        target : data.trial_list[trial].target_id,
        score : data.trial_list[trial].obj_array.length,
        level : data.trial_list[trial].level_id,
        startTimeStamp : new Date(),
      });
      console.log('Score ' + this.state.score + 'Pressed...');
    }
    console.log('totalScoreScored: ' + totalScoreScored);
    
  }

  foilList(){

    var res = [];
    for(var listNum in this.state.allOptions){
      if(this.state.allOptions[listNum]["obj_id"] != this.state.target){
        res.push(this.state.allOptions[listNum]["obj_id"]);
      }
    }

    //if we need the foil list of only the words available on the screen then use "this.state.items" 
    //instead of "this.state.allOptions"

    /*for(var listNum in this.state.items){
      if(this.state.items[listNum]["obj_id"] != this.state.target){
        res.push(this.state.items[listNum]["obj_id"]);
      }
    }*/

    return res.toString();

  }

  recordResponse(response){
      var appID = "Pick_One";
      var secID = "Not Applicable";
      var levelID = this.state.level.toString();
      var trialID = (this.state.allOptions.length - this.state.items.length ).toString();
      var timeStamp = new Date();
      var item = this.state.target;
      var foilList = this.foilList();  
      var responseTime =  timeStamp - this.state.startTimeStamp;
      var responseValue = response;
      var custom_data = "This records the response on the click of every stimuli. The respose time is in milliseconds";
      curious.reportResponse(appID,secID,levelID,trialID,timeStamp,item,foilList,responseTime,responseValue,custom_data);
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

      this.recordResponse("success");
      this.nextLevel();
    }else{
      //this.showTween();
      let temp =[]
      temp = this.state.items.splice(rowId,1);
      this.setState({  
          dataSource : this.ds.cloneWithRows(this.state.items),
      });
      this.setState({
       score : this.state.items.length,
     });
      console.log('Score ' + this.state.score + 'Pressed...');
      this.recordResponse("failure");
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

    // <Image source={require('../media/nav.png')}>
    //</Image>
    var lastThreeCharacters = this.dataPairs[this.state.target].substr(this.dataPairs[this.state.target].length - 4)
    if(lastThreeCharacters == ".png")
      return (<Image source={require('../media/cat.png')} style={styles.targetImage}></Image>);
    else 
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
    if(gameEnded){
      gameEnded = false;
      //report score for Data Collection

      var appID = "Pick_One";
      var secID = this.state.trial.toString();
      var timeStamp = new Date();
      var item = this.state.target;
      var foilList = this.foilList();
      var score = totalScoreScored.toString();
      var minScore = this.state.trial.toString();
      var maxScore = totalScore.toString();
      var custom_data = "This gives score of the combined levels";
      curious.reportScore(appID,secID,timeStamp,item,foilList,score,minScore,maxScore,custom_data);

      //calculating score -  for stars image
      const scoreRange = (totalScoreScored/totalScore)*100;
      const starIcon = require('../media/stars/one.png');

      if(scoreRange>80 && scoreRange<=100){
        starIcon = require('../media/stars/five.png');
      }else if(scoreRange>60 && scoreRange<=80){
        starIcon = require('../media/stars/four.png');
      }else if(scoreRange>40 && scoreRange<=60){
        starIcon = require('../media/stars/three.png');
      }else if(scoreRange>20 && scoreRange<=40){
        starIcon = require('../media/stars/two.png');
      }

      return(
        <Image source={require('../media/backgrounds/Game_2_Background_1280.png')}
          style={styles.backgroundImage}>
            <View>
                <Text style={styles.scoreText}>
                  Your Score : {totalScoreScored} / {totalScore}
                </Text>    
            </View>
             <Image source={starIcon}
              style={styles.starImage}>
             </Image>
             <Button
                onPress={() => navigate('Main')}
                title="Play Again ??"
                color="#841584"
        />
        </Image>
        );
       
    }else{
        return (
      <Image source={require('../media/backgrounds/Game_1_Background_1280.png')}
          style={styles.backgroundImage}>
      <View>
        <Text style={styles.level}>Level : {this.state.level}</Text>
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

PickOne.propTypes = {
scale: React.PropTypes.object,
};

AppRegistry.registerComponent('Preferences', () => App);
