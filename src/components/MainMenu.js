import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  PixelRatio,
  StyleSheet,
} from 'react-native'

import Background from '../assets/background.png'
import SoundOn from '../assets/main_icon_sound.png'
import SoundOff from '../assets/main_icon_soundoff.png'
import imprintButton from '../assets/main_icon_imprint.png'
import storyButton from '../assets/main_icon_story.png'
import gameButton from '../assets/main_icon_game.png'

import Game from './Game'
import Imprint from './Imprint'
import Story from './Story'
import Sound from './Sound'

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: null,
    height: null,
  },

  buttonRow: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 20,
    marginRight: 30,
    marginLeft: 30,
    justifyContent: 'space-between'
  },

  soundButton: {
    width: 49,
    height: 49,
  },
  soundButtonImage: {
    flex: 1,
  },

  imprintButton: {
    height: 49,
    width: 164
  },
  imprintButtonImage: {
    flex: 1
  }
})

class MainMenu extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      sound: true
    }

    console.log(PixelRatio)
  }

  _goToPage(component) {
    const route = {
      component: component,
    }
    this.props.navigator.push(route);
  }

  _toggleSound() {
    this.setState({
      sound: !this.state.sound
    })

  }

  render() {
    console.log(PixelRatio.get(60))

    const soundToggle = this.state.sound ? SoundOn : SoundOff

    return (
        <Image source={Background} resizeMode={Image.resizeMode.cover} style={styles.background}>
          <View style={styles.buttonRow}>
            <TouchableHighlight onPress={this._toggleSound.bind(this)} style={styles.soundButton}>
              <Image source={soundToggle} style={styles.soundButtonImage} resizeMode={Image.resizeMode.contain}></Image>
            </TouchableHighlight>

            <TouchableHighlight onPress={this._goToPage.bind(this, Imprint)} style={styles.imprintButton}>
              <Image style={styles.imprintButtonImage} source={imprintButton}></Image>
            </TouchableHighlight>
          </View>

          <View style={styles.buttonRow}>
            <TouchableHighlight onPress={this._goToPage.bind(this, Story)} style={styles.storyButton}>
              <Image source={storyButton}></Image>
            </TouchableHighlight>

            <TouchableHighlight onPress={this._goToPage.bind(this, Game)} style={styles.gameButton}>
              <Image source={gameButton}></Image>
            </TouchableHighlight>
          </View>
        </Image>
    )
  }
}

export default MainMenu
