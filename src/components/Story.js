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

import MainMenu from './MainMenu'

import NavigationMenu from './NavigationMenu'
import NavigationButton from './NavigationButton'

import Video from 'react-native-video'
import TestVideo from '../assets/video/1_Stadt_Grau.mp4'

import Sound from 'react-native-sound';
import bgSound from '../assets/sounds/bg1.mp3'

const bg = new Sound('bg1.mp3', Sound.MAIN_BUNDLE, () => {

})

const reader = new Sound('reader1.mp3', Sound.MAIN_BUNDLE, () => {

})

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

  componentWillMount() {
    this._slideValue = new Animated.Value(0)


  }

  componentDidMount() {
    bg.play(() => {

      bg.setNumberOfLoops(-1);
      bg.play();
    }, () => {

    })

    Animated.timing(this.state._textFade, {
      toValue: 1,
      duration: TEXT_FADE_TIME,
      easing: Easing.linear,
    }).start()
  }

  componentWillUnmount() {
    bg.pause()
  }

  _toggleMenu() {
    Animated.timing(this._slideValue, {
      toValue: this.state.menuOpen ? -200 : 0,
      duration: 500,
    }).start()
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _toggleNarration() {
    if (this.state.narrationPlaying) {
      reader.pause();
    } else {
      reader.play(() => {

      }, () => {

      })
    }
    this.setState({
      narrationPlaying: !this.state.narrationPlaying,
    })
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
    this.props.navigator.replace({ component: MainMenu })
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
              <NavigationMenu goToMenu={this._goToMenu.bind(this)} style={styles.menu}></NavigationMenu>
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
    // backgroundColor: 'blue'
  },
  textContainer: {
    width: (Window.width / 2) - 109,
    padding: 30,
    // backgroundColor: 'gray',
  },
  textBox: {
    // width: (Window.width / 2) - 109,
    width: 300,
    height: 200,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,

    // backgroundColor: 'green'
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
