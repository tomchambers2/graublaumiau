import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Image,
  ScrollView,
  TextInput,
} from 'react-native'

import colors from '../colors'

import NavigationMenu from './NavigationMenu'

import Gif from '../assets/video/giphy3.gif'

import gameObjects from '../data/gameObjects'

import Divider from '../assets/game/game_line.png'

import mailDialogBackground from '../assets/game/spiel_icon_senden.png'

class Game extends Component {
  static propTypes = {
    toggleSound: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
    soundOn: React.PropTypes.bool.isRequired,
  }

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

  _showMailDialog = () => {
    this.setState({
      showMailDialog: true,
    })
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

    const mailDialog = (
      <View style={styles.mailDialogContainer}>
        <Image source={mailDialogBackground} style={styles.mailDialogInner}>
          <TextInput style={{ width: 200, height: 50, marginTop: 70, marginLeft: 110}}>

          </TextInput>
          <TextInput></TextInput>
          <TextInput></TextInput>
        </Image>
      </View>
    )

    return (
      <View style={styles.gameContainer}>
        {this.state.showMailDialog && mailDialog}

        <View style={styles.objectMenu}>
          <ScrollView scrollEnabled={this.state.scrollEnabled}>
            {gameObjectsRender}
          </ScrollView>
        </View>
        <View style={styles.divider}>
          <Image
            style={styles.wrapper}
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
              showMailDialog={this._showMailDialog}
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
  mailDialogContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 150,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mailDialogInner: {
    width: 350,
    height: 450,
  },

  wrapper: {
    flex: 1,
  },
  navBar: {
    marginTop: 20,
    marginLeft: 17,
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  objectMenu: {
    width: 150,
    maxWidth: 150,
    backgroundColor: colors.objectMenu,
    flex: 1,
    alignItems: 'center',
  },
  playArea: {
    backgroundColor: colors.playArea,
  },
  gameObjectIcon: {
    marginTop: 15,
    marginBottom: 15,
  },
  divider: {
    flex: 1,
    maxWidth: 26,
    marginLeft: -13,
  },
  placeholder: {
      backgroundColor: colors.placeholder,
      width: 120,
      height: 150,
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
})
