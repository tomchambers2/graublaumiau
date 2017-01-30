import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native'

import SoundOn from '../assets/navigation/sound_on.png'
import SoundOff from '../assets/navigation/sound_off.png'
import Background from '../assets/menu/background.png'
import imprintButton from '../assets/menu/imprint.png'
import storyButton from '../assets/menu/story.png'
import gameButton from '../assets/menu/game.png'

import NavigationButton from './NavigationButton'

import Sound from 'react-native-sound';

import globalStyles from '../globalStyles'

class MainMenu extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    toggleSound: PropTypes.func.isRequired,
    soundOn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
  }

  _goToPage(id) {
    const route = {
      id,
    }
    this.bg.pause();
    this.props.navigator.push(route);
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
        <Image source={Background} resizeMode={Image.resizeMode.cover} style={globalStyles.fullscreen}>
          <View style={styles.interactionContainer}>
            <View style={styles.buttonRow}>
              <NavigationButton
                onPress={this.props.toggleSound}
                underlayColor="rgba(255,255,255,0)"
                activeOpacity={0.7}
                style={styles.soundButton}>
                <Image source={soundToggle} style={styles.soundButtonImage} resizeMode={Image.resizeMode.contain}></Image>
              </NavigationButton>

              <NavigationButton
                f="1"
                onPress={this._goToPage.bind(this, 'Imprint')}
                style={styles.imprintButton}>
                <Image style={styles.imprintButtonImage} source={imprintButton}></Image>
              </NavigationButton>
            </View>

            <View style={styles.spacer}></View>

            <View style={[styles.buttonRow, styles.bottomButtons]}>
              <NavigationButton
                onPress={this._goToPage.bind(this, 'Story')}>
                <Image source={storyButton}></Image>
              </NavigationButton>

              <NavigationButton
                onPress={this._goToPage.bind(this, 'Game')}>
                <Image source={gameButton}></Image>
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
    borderRadius: 9999,
  },
  soundButtonBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundButtonImage: {
    height: 38,
    width: 38,
  },
  imprintButtonImage: {
    flex: 1,
  },
  imprintButton: {
    height: 49,
    width: 164,
  },
})
