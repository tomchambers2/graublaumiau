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
  ScrollView
} from 'react-native'

import Video from 'react-native-video'
import TestVideo from '../assets/video/7_Kauz.mp4'

import Gif from '../assets/video/giphy3.gif'

import gameObjects from '../data/gameObjects'

const CIRCLE_RADIUS = 36
const Window = Dimensions.get('window')

class Game extends Component {
  constructor() {
    super();

    const pans = []
    gameObjects.forEach((gameObject) => {
      pans.push(new Animated.ValueXY())
    })

    this.state = {
      pans,
      scrollEnabled: true
    }

    this.panResponders = []

    gameObjects.forEach((gameObject, i) => {
      this.panResponders[i] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, {
          dx: this.state.pans[i].x,
          dy: this.state.pans[i].y
        }]),
        onPanResponderGrant: () => {
          console.log('grant activated')
          this.setState({
            scrollEnabled: false
          })
          return true
        },
        onPanResponderRelease: (e, gesture) => {
          console.log('lifted')
          this.setState({
            scrollEnabled: true
          })
        }
      })
    });
  }

  render() {
    const gameObjectsRender = gameObjects.map((gameObject, i) => {
      return (
        <View style={styles.draggableContainer}>
          <Animated.View
            {...this.panResponders[i].panHandlers}
            style={[this.state.pans[i].getLayout(), styles.placeholder]}>
            <Text style={styles.text}>Drag me</Text>
          </Animated.View>
        </View>
      )
    })

    return (
      <View style={styles.gameContainer}>
        <View style={styles.objectMenu}>
          <ScrollView scrollEnabled={this.state.scrollEnabled}>
            {gameObjectsRender}
          </ScrollView>
        </View>
        <View style={styles.playArea}>
          {this.renderVideos()}
        </View>
      </View>
    )
  }

  renderVideos() {
    const videos = []
    for (var i = 0; i < 0; i++) {
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

}

export default Game

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
      // position    : 'absolute',
      // top         : Window.height/2 - CIRCLE_RADIUS,
      // left        : 100
  },
  placeholder      : {
      backgroundColor     : 'black',
      width               : CIRCLE_RADIUS*2,
      height              : CIRCLE_RADIUS*2,
      borderColor: 'black'
  }
})
