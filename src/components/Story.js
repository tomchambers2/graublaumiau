import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Animated,
  Text,
  Dimensions,
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

const dummy = "Schlitz flannel plaid raw denim glossier seitan vegan gentrify fingerstache iceland cardigan. Cliche meggings food truck pickled drinking vinegar master cleanse. Umami shoreditch pug, PBR&B tousled pitchfork truffaut.\n" +
"\n\nUmami af keffiyeh raw denim +1 gent 90's banh mi 8-bit synth polaroid irony banjo tumblr."

const Window = Dimensions.get('window')

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
        <Video source={TestVideo} repeat={true} style={styles.backgroundVideo}></Video>

        <View style={styles.interactionContainer}>

          <View style={{ flexGrow: 1, flexDirection: 'row' }}>
            <View style={styles.topMenu}>
              <NavigationMenu goToMenu={this._goToMenu.bind(this)} style={styles.menu}></NavigationMenu>
              {this.renderNarrationButton.bind(this)()}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textBox}>{dummy}</Text>
            </View>
          </View>

          <View style={styles.spacer}></View>

          <View style={styles.navigationBar}>

            <TouchableHighlight>
              <Image style={styles.navigateLeftImage} resizeMode={Image.resizeMode.contain} source={NavigateLeft}></Image>
            </TouchableHighlight>
            <TouchableHighlight>
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

    backgroundColor: 'blue'
  },
  textContainer: {
    width: (Window.width / 2) - 109,
    backgroundColor: 'gray',
    padding: 30,
  },
  textBox: {
    fontSize: 30
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,

    backgroundColor: 'green'
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
