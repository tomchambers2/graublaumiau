import React, { Component } from 'react'
import {
  StyleSheet,
} from 'react-native'

import Video from 'react-native-video'
import loadingVideo from '../assets/loadingVideo.mp4'

class SplashScreen extends Component {
  render() {
    return (
      <Video
        style={styles.backgroundVideo}
        ref={(ref) => {
          this.player = ref
        }}
        muted
        repeat={true}
        source={loadingVideo}
        resizeMode="cover"
      />
    )
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.hideSplashScreen()
    }, 5000)
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})

export default SplashScreen
