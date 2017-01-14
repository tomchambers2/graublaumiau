import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Animated,
} from 'react-native'

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

import Play from '../assets/story2/story_icon_read.png'
import Pause from '../assets/story2/story_icon_read_pause.png'
import NavigateLeft from '../assets/story2/story_icon_link.png'
import NavigateRight from '../assets/story2/story_icon_rechts.png'

class Story extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      narrationPlaying: false,
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
    }, () => {

    })
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

  _goToMenu() {
    this.props.navigator.pop()
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

  render() {
    return (
      <View style={styles.mainWrapper}>
        <Video
        source={TestVideo}
        repeat={true}
        style={styles.backgroundVideo}></Video>
        <View style={styles.interactionContainer}>
          <View style={styles.topMenu}>
            <NavigationMenu goToMenu={this._goToMenu.bind(this)} style={styles.menu}></NavigationMenu>
            {this.renderNarrationButton.bind(this)()}
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.navigationBar}>
            <TouchableHighlight style={styles.navigateLeft}>
              <Image style={styles.navigateLeftImage} resizeMode={Image.resizeMode.contain} source={NavigateLeft}></Image>
            </TouchableHighlight>
            <TouchableHighlight style={styles.navigateRight}>
              <Image style={styles.navigateRightImage} resizeMode={Image.resizeMode.contain} source={NavigateRight}></Image>
            </TouchableHighlight>
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
    zIndex: -50,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },

  interactionContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },

  topMenu: {
    flex: 1,
    flexGrow: 5,
    flexBasis: 20,

    paddingLeft: 30,
    paddingTop: 20,
  },
  menu: {
    maxHeight: 50,
  },
  navigationBar: {
    flex: 1,
    flexBasis: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  navigateLeft: {
    height: 49,
    width: 49,
  },
  navigateRight: {
    height: 49,
    width: 49,
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
