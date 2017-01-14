import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableHighlight,
  Image,
  Animated,
} from 'react-native'

import Video from 'react-native-video'
import TestVideo from '../assets/video/1_Stadt_Grau.mp4'

import Sound from 'react-native-sound';
import bgSound from '../assets/sounds/bg1.mp3'

const bg = new Sound('bg1.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) return console.log(error)
})

const reader = new Sound('reader1.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) return console.log(error)
})

import MenuOn from '../assets/story/story_icon_menu.png'
import MenuOpen from '../assets/story/story_icon_menu1.png'
import Play from '../assets/story/story_icon_read.png'
import Pause from '../assets/story/story_icon_read_pause.png'
import NavigateLeft from '../assets/story/story_icon_link.png'
import NavigateRight from '../assets/story/story_icon_rechts.png'

class Story extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      narrationPlaying: false,
    }
  }

  componentWillMount() {
    this._slideValue = new Animated.Value(0)
  }

  componentDidMount() {
    bg.play(() => {
      console.log('success finish')
      bg.setNumberOfLoops(-1);
    }, () => {
      console.log('error finish')
    })
  }

  _toggleMenu() {
    Animated.timing(this._slideValue, {
      toValue: this.state.menuOpen ? -200 : 0,
      duration: 500,
    }).start()
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }

  _toggleNarration() {
    if (this.state.narrationPlaying) {
      reader.pause();
    } else {
      reader.play(() => {
        console.log('success finish')
      }, () => {
        console.log('error finish')
      })
    }
    this.setState({
      narrationPlaying: !this.state.narrationPlaying
    })
  }

  renderNarrationButton() {
    const button = this.state.narrationPlaying ?
    (<TouchableHighlight onPress={this._toggleNarration.bind(this)}  style={styles.playButton}>
    <Image style={styles.playToggleImage} resizeMode={Image.resizeMode.contain} source={Pause}></Image>
    </TouchableHighlight>)
    : (<TouchableHighlight onPress={this._toggleNarration.bind(this)}  style={styles.playButton}>
      <Image style={styles.playToggleImage} onPress={this._toggleNarration.bind(this)} resizeMode={Image.resizeMode.contain} source={Play}></Image>
    </TouchableHighlight>)
    return button;
  }

  renderMenu() {
    // const menu = //this.state.menuOpen ?
    //             (<TouchableHighlight onPress={this._toggleMenu.bind(this)} style={styles.menuToggle}>
    //               <Image style={styles.menuOpen} resizeMode={Image.resizeMode.contain} source={MenuOpen}></Image>
    //             </TouchableHighlight>)
    //              (<Animated.View style={{ transform: [{ translateX: this._slideValue }] }}>
    //               <TouchableHighlight onPress={this._toggleMenu.bind(this)} style={styles.menuToggle}>
    //                 <Image style={styles.menuToggleImage} resizeMode={Image.resizeMode.contain} source={MenuOn}></Image>
    //               </TouchableHighlight></Animated.View>)
    // return menu
    return                 (<View>
                      <TouchableHighlight onPress={this._toggleMenu.bind(this)} style={styles.menuToggle}>
                        <Image style={styles.menuToggleImage} resizeMode={Image.resizeMode.contain} source={MenuOn}></Image>
                      </TouchableHighlight>
                      <Animated.View style={[styles.openedMenu, { transform: [{ translateX: this._slideValue }] }]}>
                        <TouchableHighlight onPress={this._toggleMenu.bind(this)} style={styles.menuToggle}>
                          <Image style={styles.menuOpen} resizeMode={Image.resizeMode.contain} source={MenuOpen}></Image>
                        </TouchableHighlight>
                      </Animated.View>
                      </View>)
  }

  render() {
    return (
      <Video
        source={TestVideo}
        style={styles.backgroundVideo}>
        <View style={styles.interactionContainer}>
          <View style={styles.topMenu}>
            {this.renderMenu.bind(this)()}
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
      </Video>
    )
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1
  },


  interactionContainer: {
    flex: 1
  },

  topMenu: {
    // backgroundColor: 'green',

    flex: 1,
    flexGrow: 5,
    flexBasis: 20,

    paddingLeft: 30,
    paddingTop: 20,
  },
  spacer: {
    // flexGrow: 10,
  },
  navigationBar: {
    // backgroundColor: 'blue',

    flex: 1,
    flexBasis: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
    alignItems: 'flex-end'
  },


  navigateLeft: {
    height: 49,
    width: 49
  },
  navigateRight: {
    height: 49,
    width: 49,
  },
  navigateLeftImage: {
    width: 49,
    height: 49
  },
  navigateRightImage: {
    width: 49,
    height: 49
  },

  playToggle: {
    height: 49,
    width: 49,
  },
  playToggleImage: {
    width: 49,
    height: 49
  },
  menuToggle: {
    height: 49,
    width: 49,
  },
  menuToggleImage: {
    width: 49,
    height: 49,
  },
  menuOpen: {
    height: 49,
    width: 220,
  },
  openedMenu: {
    position: 'absolute',
    zIndex: -10,
    marginLeft: -50,
  },
  playButton: {

  },
})

export default Story
