import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableHighlight,
  PanResponder,
  Animated,
  Dimensions,
  Image,
} from 'react-native'

import Video from 'react-native-video'
import TestVideo from '../assets/video/7_Kauz.mp4'

import Gif from '../assets/video/giphy3.gif'

const CIRCLE_RADIUS = 36
const Window = Dimensions.get('window')

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  objectMenu: {
    width: 180,
    backgroundColor: '#f2f2f2'
  },
  playArea: {
    backgroundColor: '#fff',
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  testSquare: {
    // width: 200,
    // height: 200,
  },

  gameObject: {

  },

  text        : {
      marginTop   : 25,
      marginLeft  : 5,
      marginRight : 5,
      textAlign   : 'center',
      color       : '#fff'
  },
  draggableContainer: {
    backgroundColor: 'green',
      position    : 'absolute',
      top         : Window.height/2 - CIRCLE_RADIUS,
      left        : 100
  },
  circle      : {
      backgroundColor     : 'black',
      width               : CIRCLE_RADIUS*2,
      height              : CIRCLE_RADIUS*2,
      borderRadius        : CIRCLE_RADIUS
  }
})

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY()
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),
      onPanResponderRelease: (e, gesture) => {}
    })
  }

  render() {

    this.props.gameObjects = []
    // const gameObjects = this.props.gameObjects.map((gameObject) => {
    const gameObjects = [].map((gameObject) => {
      return (
        <Image style={styles.gameObject}><Text>Show an object here as static image</Text></Image>
      )
    })

    return (
      <View style={styles.gameContainer}>
        <View style={styles.objectMenu}>
          {this.renderDraggable()}
        </View>
        <View style={styles.playArea}>
          {this.renderVideos()}
        </View>
      </View>
    )
  }

  renderVideos() {
    const videos = []
    for (var i = 0; i < 20; i++) {
      // const video =           (<Video
      //               style={styles.testSquare}
      //               source={TestVideo}
      //               repeat={true}></Video>)

      const video = (<Image
      style={styles.testSquare}
      source={Gif}></Image>)

      videos.push(video);
    }
    return videos
  }

  renderDraggable() {
    return (
      <View style={styles.draggableContainer}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.pan.getLayout(), styles.circle]}>
          <Text style={styles.text}>Drag me</Text>
        </Animated.View>
      </View>
    )
  }
}

export default Game
