import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Alert,
  TouchableHighlight,
  Text,
} from 'react-native'

import page0 from '../story/0'
import page1 from '../story/1'
import page2 from '../story/2'
import page3 from '../story/3'

const pages = {
  0: page0,
  1: page1,
  2: page2,
  3: page3,
}

const startingNarration = new Sound('narration-0.mp3', Sound.MAIN_BUNDLE)
const soundFilenames = ['story_background_1.mp3', 'story_background_2.mp3']

const sounds = {}
sounds[soundFilenames[0]] = new Sound(soundFilenames[0], Sound.MAIN_BUNDLE)
sounds[soundFilenames[1]] = new Sound(soundFilenames[1], Sound.MAIN_BUNDLE)

const TEXT_FADE_TIME = 1000
const BACKGROUND_SOUND_CHANGE_PAGE = 2

import NavigationMenu from './NavigationMenu'
import NavigationButton from './NavigationButton'

import Video from 'react-native-video'

import Sound from 'react-native-sound';

import playIcon from '../assets/story2/story_icon_read.png'
import pauseIcon from '../assets/story2/story_icon_read_pause.png'
import NavigateLeft from '../assets/story2/story_icon_link.png'
import NavigateRight from '../assets/story2/story_icon_rechts.png'
import endButton from '../assets/story2/story_icon_ende.png'

class Story extends Component {
  constructor() {
    super()

    this.state = {
      narrationPlaying: false,
      _textFade: new Animated.Value(0),
      page: 0,
      totalPages: 4,
      currentBackgroundSound: soundFilenames[0],
    }
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    soundOn: PropTypes.bool.isRequired,
    toggleSound: PropTypes.func.isRequired,
  }

  _pauseNarration(options={}) {
    this.setState({
      narrationPlaying: false,
    })
    this.narration.pause()
    if (options.reset) {
      this.narration.setCurrentTime(0)
    }
  }

  _playNarration() {
    if (!this.props.soundOn) this.props.toggleSound()
    this.setState({ narrationPlaying: true })

    this.narration.play((result) => {
      if (result) this._pauseNarration()
    })
  }

  _toggleNarration = () => {
    if (this.state.narrationPlaying) {
      this._pauseNarration()
    } else {
      this._playNarration()
    }
  }

  _toggleSound = () => {
    this.props.toggleSound()
  }

  _goToMenu() {
    this.backgroundSound.pause()
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  _navigateLeft = () => {
    if (this.state.page === 0) {
      this._goToMenu()
    } else {
      this.setState({
        page: this.state.page - 1,
      })
      this._updateBackgroundSound(this.state.page - 1)
    }
  }

  _navigateRight = () => {
    if ((this.state.page + 1) < this.state.totalPages) {
      this.setState({
        page: this.state.page + 1,
      })
      const newPage = this.state.page + 1
      this._updateBackgroundSound(newPage)
    } else {
      this._goToMenu()
    }
  }

  _updateBackgroundSound(page) {
    if (page >= BACKGROUND_SOUND_CHANGE_PAGE) {
      if (soundFilenames[1] !== this.state.currentBackgroundSound) {
        this.backgroundSound.pause()
        this.backgroundSound = sounds[soundFilenames[1]]
        this.backgroundSound.play()
        this.setState({
          currentBackgroundSound: soundFilenames[1],
        })
      }
    } else {
      if (soundFilenames[0] !== this.state.currentBackgroundSound) {
        this.backgroundSound.pause()
        this.backgroundSound = sounds[soundFilenames[0]]
        this.backgroundSound.play()
        this.setState({
          currentBackgroundSound: soundFilenames[0],
        })
      }
    }
  }

  _fadeInText() {
    Animated.timing(this.state._textFade, {
      toValue: 1,
      duration: TEXT_FADE_TIME,
      easing: Easing.linear,
    }).start()
  }

  _startSound() {
    if (!this.props.soundOn) {
      this.backgroundSound.setVolume(0)
      this.narration.setVolume(0)
    }
    this.backgroundSound.setNumberOfLoops(-1);
    this.backgroundSound.play()
  }

  componentDidMount() {
    this.backgroundSound = sounds[soundFilenames[0]]
    this.narration = startingNarration

    this._startSound()
    this._fadeInText()
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.soundOn) {
      this.backgroundSound.setVolume(0)
      this.narration.setVolume(0)
      this._pauseNarration()
    } else {
      this.backgroundSound.setVolume(1)
      this.narration.setVolume(1)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this._pauseNarration()
      this.narration = new Sound(`narration-${this.state.page}.mp3`, Sound.MAIN_BUNDLE)
    }
  }

  componentWillUnmount() {
    this.backgroundSound.pause()
    this._pauseNarration({ reset: true })
  }

  _playSoundClip = (soundName) => {
    return () => {
      const sound = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
        sound.play()
      })
    }
  }

  renderClickMaps() {
    if (!this.state.page.clickMap) return
    return pages[this.state.page].clickMap.map((area) => {
      return (
        <TouchableHighlight
          onPress={this._playSoundClip(area.soundName)}
          style={[styles.clickArea, { width: area.width, height: area.height, top: area.top, right: area.right }]}>
            <Text>clickable area</Text>
        </TouchableHighlight>
      )
    })
  }

  render() {
    const atEnd = (this.state.page + 1) === this.state.totalPages
    const navigateRight = atEnd ? endButton : NavigateRight
    const narrationButtonIcon = this.state.narrationPlaying ? pauseIcon : playIcon

    return (
      <View style={styles.mainWrapper}>
        {this.renderClickMaps()}

        <Video
          source={pages[this.state.page].video}
          repeat={true}
          style={styles.backgroundVideo} />

        <Animated.Image
          source={pages[this.state.page].text}
          style={[styles.textBox, { opacity: this.state._textFade }]}
          resizeMode={Image.resizeMode.contain} />

        <View style={styles.interactionContainer}>

          <View style={styles.menuAndContent}>
            <View style={styles.topMenu}>
              <NavigationMenu
                toggleSound={this._toggleSound}
                soundOn={this.props.soundOn}
                goToMenu={this._goToMenu.bind(this)}
                style={styles.menu} />
              <NavigationButton
                onPress={this._toggleNarration}
                style={styles.playButton}>
                <Image
                  style={styles.playToggleImage}
                  resizeMode={Image.resizeMode.contain}
                  source={narrationButtonIcon} />
              </NavigationButton>
            </View>
          </View>

          <View style={styles.spacer} />

          <View style={styles.navigationBar}>

            <NavigationButton
              onPress={this._navigateLeft}>
              <Image
                style={styles.navigateLeftImage}
                resizeMode={Image.resizeMode.contain}
                source={NavigateLeft}></Image>
            </NavigationButton>
            <NavigationButton
              onPress={this._navigateRight}>
              <Image style={[styles.navigateRightImage, atEnd && styles.endButton]}
                resizeMode={Image.resizeMode.contain}
                source={navigateRight}></Image>
            </NavigationButton>

          </View>

        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  endButton: {
    width: 94,
    height: 51,
  },
  clickArea: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'yellow'
  },
  spacer: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  interactionContainer: {
    flex: 1,
  },
  menuAndContent: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  topMenu: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingRight: 30,
    position: 'relative',
    zIndex: 10,
  },
  textBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    width: null,
    height: null,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  navigateLeftImage: {
    width: 49,
    height: 49,
  },
  navigateRightImage: {
    width: 49,
    height: 49,
  },
  playToggleImage: {
    width: 49,
    height: 49,
  },
  playButton: {
    marginTop: 18,
  },
})

export default Story
