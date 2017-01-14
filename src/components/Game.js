import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native'

import NavigationMenu from './NavigationMenu'

import Gif from '../assets/video/giphy3.gif'

import gameObjects from '../data/gameObjects'

import Divider from '../assets/game/game_line.png'

const Window = Dimensions.get('window')

class Game extends Component {
  constructor() {
    super();

    const pans = []
    gameObjects.forEach(() => {
      pans.push(new Animated.ValueXY())
    })

    this.state = {
      pans,
      scrollEnabled: true,
    }

    this.panResponders = []

    gameObjects.forEach((gameObject, i) => {
      this.panResponders[i] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, {
          dx: this.state.pans[i].x,
          dy: this.state.pans[i].y,
        }]),
        onPanResponderGrant: () => {
          this.setState({
            scrollEnabled: false,
          })
          return true
        },
        onPanResponderRelease: () => {
          this.setState({
            scrollEnabled: true,
          })
        },
      })
    });
  }

  render() {
    const gameObjectsRender = gameObjects.map((gameObject, i) => {
      return (
        <View style={[styles.gameObjectIcon, styles.draggableContainer]}>
          <Animated.View
            {...this.panResponders[i].panHandlers}
            style={[this.state.pans[i].getLayout(), styles.placeholder]}>
            <Text style={styles.text}>Placeholder</Text>
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
        <Image
          style={styles.divider}
          source={Divider}
          height={Window.height}>
        </Image>
        <View style={styles.playArea}>
          <NavigationMenu full></NavigationMenu>
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
    width: 150,
    maxWidth: 150,
    backgroundColor: '#f2f2f2',
    flex: 1,
    alignItems: 'center',
  },
  playArea: {
    backgroundColor: '#fff',
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  gameObjectIcon: {
    marginTop: 15,
    marginBottom: 15,
  },

  divider: {
    marginLeft: -10,
  },

  placeholder: {
      backgroundColor: 'white',
      width: 120,
      height: 150,
      borderColor: 'black',
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
})
