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
  Dimensions,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import _ from 'lodash';
import Preferences from './Preferences';
import Trial from './Trial';
import AnimatedSprite from 'react-native-animated-sprite';
import monsterSprite from './sprites/monster/monsterSprite';
import gameIcon from "./media/gameIcon/gameIcon";
import styles from './styles';

const Sound = require('react-native-sound');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const baseHeight = 800;
const baseWidth = 1280;

export default class LearnByDoing extends Component {
  constructor (props) {
    super(props);
    this.state = {
      iconArray: [],
    };
    const scaleWidth = screenWidth / baseWidth;
    const scaleHeight = screenHeight / baseHeight;
    this.scale = {
      screenWidth: scaleWidth,
      screenHeight: scaleHeight,
      image: scaleHeight > scaleWidth ? scaleWidth : scaleHeight,
    };

    const iconList = [
      {
        name: 'BUBBLE',
        imgSrc: require('./media/gameIcon/game2_icon_color.png'),
        location: {top: 130, left: 100},
        frameIndex: [3],
      },
      {
        name: 'BUBBLE22',
        imgSrc: require('./media/gameIcon/game6_icon_color.png'),
        location: {top: 230, left: 200},
        frameIndex: [5],
      },
    ];

    this.iconList = _.shuffle(iconList);
    this.iconAppearTimeout = [];
    this.gameIcon = {tweenOptions: {}};
    this.iconRefs = [];
    this.initIcons();
    this.popSound;
    this.popPlaying = false;
  }
  
  componentDidMount () {
    _.forEach(this.iconList, (icon, index) => {
      const timeout = setTimeout(() => {
        debugger;
        let iconRef = this.refs[this.iconRefs[index]];
        iconRef.startTween();
      }, 100 * index);
      this.iconAppearTimeout.push(timeout);
    });
    this.initSounds();
  }

  initSounds () {
    this.popSound = new Sound('ambient_swamp.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('failed to load the sounddddd', error);
        return;
      }
      this.popSound.setNumberOfLoops(0);
      this.popSound.setVolume(5);
    });

    if (!this.popPlaying) {
      this.popPlaying = true;
      this.popSound.play(() => {this.popPlaying = false;});
    }
  }

  componentWillUnmount () {
    _.forEach(this.iconAppearTimeout, timeout => clearTimeout(timeout));
  }
  
  startSize () {
    return ({
      width: 240 * this.scale.image,
      height: 240 * this.scale.image,
    });
  }

  scaleLocation (location) {
    return ({
      top: location.top * this.scale.screenHeight,
      left: location.left * this.scale.screenWidth,
    });

  }

  makeZoomTween (startScale=0.01, endScale= 1, duration=1000) {
    //React bug (I think): Scale of 0 is set to 1 on load
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
  
  static navigationOptions = {
    title: 'WELCOME HERE',
    header: false
  };
  
  press () {
    const { navigate } = this.props.navigation;
    console.log("PRESS PRESS");
    navigate('trial');
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
        onPress={() => this.press()}
      />);
    });
  }
  
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{ flex: 1, }}
      >
        <Button
          onPress={() => navigate('Prefs')}
          title="Go to Prefs"
        />
        <Image
          source={require('./media/backgrounds/Game_5_Background_1280.png')}
          style={{
            opacity: 1,
            width: 1280,
            height: 800,
          }}
        />
      {this.icons}
        
      </View>
    );
  }
}

const App = StackNavigator({
  Main: {screen: LearnByDoing},
  Prefs: {screen: Preferences},
  trial:{screen: Trial},
});

LearnByDoing.propTypes = {
  scale: React.PropTypes.object,
};

AppRegistry.registerComponent('LearnByDoing', () => App);
