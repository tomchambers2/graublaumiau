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

import MainMenu from './MainMenu'

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

  _toggleSound = () => {
    this.props.toggleSound()
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.soundOn) {
      // turn sound off
    } else {
      // turn sound on
    }
  }

  _goToMenu() {
    // bg.pause()
    this.props.navigator.resetTo({ id: 'MainMenu' })
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
        <View style={styles.divider}>
          <Image
            style={{flex: 1}}
            resizeMode={Image.resizeMode.contain}
            source={Divider}>
          </Image>
        </View>
        <View style={styles.playArea}>
          <View style={styles.navBar}>
            <NavigationMenu
              full
              toggleSound={this._toggleSound}
              soundOn={this.props.soundOn}
              goToMenu={this._goToMenu.bind(this)} />
          </View>
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
  navBar: {
    paddingTop: 20,
    marginLeft: 17,
  },
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
  },

  gameObjectIcon: {
    marginTop: 15,
    marginBottom: 15,
  },

  divider: {
    flex: 1,
    maxWidth: 26,
    marginLeft: -13
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
