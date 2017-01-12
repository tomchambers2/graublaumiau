import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native'

import Video from 'react-native-video'
import TestVideo from '../assets/video/1_Stadt_Grau.mp4'

import MenuOn from '../assets/story/story_icon_menu.png'
import MenuOpen from '../assets/story/story_icon_menu1.png'
import Play from '../assets/story/story_icon_read.png'
import Pause from '../assets/story/story_icon_read_pause.png'
import NavigateLeft from '../assets/story/story_icon_link.png'
import NavigateRight from '../assets/story/story_icon_rechts.png'

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
  playButton: {

  },
})

class Story extends Component {
  render() {
    return (
      <Video
          style={styles.backgroundVideo}
          source={TestVideo}
          resizeMode="cover"
          repeat={true}>
      <View style={styles.interactionContainer}>
        <View style={styles.topMenu}>
          <TouchableHighlight style={styles.menuToggle}>
           <Image style={styles.menuToggleImage} resizeMode={Image.resizeMode.contain} source={MenuOn}></Image>
          </TouchableHighlight>
          <TouchableHighlight style={styles.playButton}>
            <Image style={styles.playToggleImage} resizeMode={Image.resizeMode.contain} source={Play}></Image>
          </TouchableHighlight>
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

export default Story
