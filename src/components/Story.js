import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Animated,
  Text,
  Dimensions,
  Easing,
} from 'react-native'

const TEXT_FADE_TIME = 1000

import NavigationMenu from './NavigationMenu'
import NavigationButton from './NavigationButton'

import Video from 'react-native-video'
import TestVideo from '../assets/video/1_Stadt_Grau.mp4'

import Sound from 'react-native-sound';
import bgSound from '../assets/sounds/bg1.mp3'

const bg = new Sound('bg1.mp3', Sound.MAIN_BUNDLE, () => {})

const reader = new Sound('clap-808.wav', Sound.MAIN_BUNDLE, () => {})

import textImage from '../assets/page1.png'

const Window = Dimensions.get('window')

import Play from '../assets/story2/story_icon_read.png'
import Pause from '../assets/story2/story_icon_read_pause.png'
import NavigateLeft from '../assets/story2/story_icon_link.png'
import NavigateRight from '../assets/story2/story_icon_rechts.png'
import endButton from '../assets/story2/story_icon_ende.png'

class Story extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      narrationPlaying: false,
      _textFade: new Animated.Value(0),
      page: 0,
      totalPages: 1,
    }
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (!this.props.soundOn) {
      bg.setVolume(0)
    }
    bg.setNumberOfLoops(-1);
    bg.play()
    Animated.timing(this.state._textFade, {
      toValue: 1,
      duration: TEXT_FADE_TIME,
      easing: Easing.linear,
    }).start()
  }

  componentWillUnmount() {
    bg.pause()
    _pauseNarration({ reset: true })
  }

  _pauseNarration(options={}) {
    this.setState({
      narrationPlaying: false,
    })
    reader.pause()
    if (options.reset) {
      reader.setCurrentTime(0)
    }
  }

  _playNarration() {
    console.log('play NOW')
    if (!this.props.soundOn) {
      this.props.toggleSound()
    }
    this.setState({
      narrationPlaying: true,
    })
    reader.play((result) => {
      if (result) {
        this._pauseNarration()
      } else {
        console.error(success)
      }
    })
  }

  _toggleNarration() {
    if (this.state.narrationPlaying) {
      this._pauseNarration()
    } else {
      this._playNarration()
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.soundOn) {
      bg.setVolume(0)
      reader.setVolume(0)
      reader.pause()
      this.setState({
        narrationPlaying: false
      })
    } else {
      bg.setVolume(1)
      reader.setVolume(1)
    }
  }

  _toggleSound = () => {
    this.props.toggleSound()
  }

  renderNarrationButton() {
    const button = this.state.narrationPlaying ?
    (<NavigationButton onPress={this._toggleNarration.bind(this)}  style={styles.playButton}>
    <Image style={styles.playToggleImage} resizeMode={Image.resizeMode.contain} source={Pause}></Image>
    </NavigationButton>)
    : (<NavigationButton onPress={this._toggleNarration.bind(this)}  style={styles.playButton}>
      <Image style={styles.playToggleImage} onPress={this._toggleNarration.bind(this)} resizeMode={Image.resizeMode.contain} source={Play}></Image>
    </NavigationButton>)
    return button;
  }

  _goToMenu() {
    bg.pause()
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  navigateLeft() {
    if (this.state.page === 0) {
      this._goToMenu()
    } else {
      this.setState({
        page: this.state.page - 1
      })
    }
  }

  navigateRight() {
    if ((this.state.page + 1) < this.state.totalPages) {
      this.setState({
        page: this.state.page + 1
      })
    }
  }

  render() {
    const atEnd = (this.state.page + 1) === this.state.totalPages
    const navigateRight = atEnd ? endButton : NavigateRight

    return (
      <View style={styles.mainWrapper}>
        <Video source={TestVideo} repeat={true} style={styles.backgroundVideo}></Video>

        <View style={styles.interactionContainer}>

          <View style={{ flexGrow: 1, flexDirection: 'row' }}>
            <View style={styles.topMenu}>
              <NavigationMenu
                toggleSound={this._toggleSound}
                soundOn={this.props.soundOn}
                goToMenu={this._goToMenu.bind(this)}
                style={styles.menu} />
              {this.renderNarrationButton.bind(this)()}
            </View>
            <View style={styles.textContainer}>
              <Animated.Image source={textImage} style={[styles.textBox, { opacity: this.state._textFade }]} resizeMode={Image.resizeMode.contain}></Animated.Image>
            </View>
          </View>

          <View style={styles.spacer}></View>

          <View style={styles.navigationBar}>

            <NavigationButton
              onPress={this.navigateLeft.bind(this)}>
              <Image
                style={styles.navigateLeftImage}
                resizeMode={Image.resizeMode.contain}
                source={NavigateLeft}></Image>
            </NavigationButton>
            <NavigationButton
              onPress={this.navigateRight.bind(this)}>
              <Image style={styles.navigateRightImage}
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
  topMenu: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingRight: 30,
    position: 'relative',
    zIndex: 10,
  },
  textContainer: {
    width: (Window.width / 2) - 109,
    padding: 30,
  },
  textBox: {
    width: 300,
    height: 200,
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
