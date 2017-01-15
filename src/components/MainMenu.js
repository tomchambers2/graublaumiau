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
import SoundBackground from '../assets/menu/main_sound_back.png'
import SoundOn from '../assets/menu/main_sound_top_on.png'
import SoundOff from '../assets/menu/main_sound_top_off.png'
import imprintButtonBackground from '../assets/menu/main_imprint_back.png'
import imprintButton from '../assets/menu/main_imprint_top.png'
import storyButtonBackground from '../assets/menu/main_story_back.png'
import gameButtonBackground from '../assets/menu/main_game_back.png'
import storyButton from '../assets/menu/main_story_top.png'
import gameButton from '../assets/menu/main_game_top.png'

import NavigationButton from './NavigationButton'

import Sound from 'react-native-sound';

class MainMenu extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  _goToPage(id) {
    const route = {
      id
    }
    this.bg.pause();
    this.props.navigator.push(route);
  }

  _toggleSound() {
    this.props.toggleSound()
  }

  componentDidMount() {
    this.bg = new Sound('main_sound.mp3', Sound.MAIN_BUNDLE, () => {
      if (!this.props.soundOn) {
        this.bg.setVolume(0)
      }
      this.bg.setNumberOfLoops(-1)
      this.bg.play()
    })
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.soundOn) {
      this.bg.setVolume(0)
    } else {
      this.bg.setVolume(1)
    }
  }

  render() {

    const soundToggle = this.props.soundOn ? SoundOn : SoundOff

    return (
        <Image source={Background} resizeMode={Image.resizeMode.cover} style={styles.background}>
          <View style={styles.interactionContainer}>
            <View style={styles.buttonRow}>
              <NavigationButton
                onPress={this._toggleSound.bind(this)}
                underlayColor="rgba(255,255,255,0)"
                activeOpacity={0.7}
                style={styles.soundButton}>
                <Image source={SoundBackground} style={styles.soundButtonBackground} resizeMode={Image.resizeMode.contain}>
                  <Image source={soundToggle} style={styles.soundButtonImage} resizeMode={Image.resizeMode.contain}></Image>
                </Image>
              </NavigationButton>

              <NavigationButton
                onPress={this._goToPage.bind(this, 'Imprint')}
                style={styles.imprintButton}>
                <Image style={styles.imprintButtonImage} source={imprintButtonBackground}>
                  <Image style={styles.imprintButtonImage} source={imprintButton}></Image>
                </Image>
              </NavigationButton>
            </View>

            <View style={styles.spacer}></View>

            <View style={[styles.buttonRow, styles.bottomButtons]}>
              <NavigationButton
                onPress={this._goToPage.bind(this, 'Story')}
                style={styles.storyButton}>
                <Image source={storyButtonBackground}>
                  <Image source={storyButton}></Image>
                </Image>
              </NavigationButton>

              <NavigationButton
                onPress={this._goToPage.bind(this, 'Game')}
                style={styles.gameButton}>
                <Image source={gameButtonBackground}>
                  <Image source={gameButton}></Image>
                </Image>
              </NavigationButton>
            </View>
          </View>
        </Image>
    )
  }
}

export default MainMenu

const styles = StyleSheet.create({
  interactionContainer: {
    flex: 1,
  },
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
    justifyContent: 'space-between',
    paddingBottom: 44,
  },
  bottomButtons: {
    alignItems: 'flex-end',
  },
  soundButton: {
    width: 49,
    height: 49,
    borderRadius: 9999
  },
  soundButtonBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  soundButtonImage: {
    height: 38,
    width: 38
  },
  imprintButton: {
    height: 49,
    width: 164
  },
  imprintButtonImage: {
    flex: 1
  }
})
