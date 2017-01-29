import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'

import Video from 'react-native-video'
import loadingVideo from '../assets/loadingVideo.mp4'

class SplashScreen extends Component {
  _onVideoEnd = () => {
    console.log('video ended now')
    alert('video over')
  }

  render() {
    return (
      <Video
        style={styles.backgroundVideo}
        ref={(ref) => {
          this.player = ref
        }}
        muted
        repeat={false}
        source={loadingVideo}
        resizeMode="cover"
        onEnd={this._onVideoEnd}
      />
    )
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.hideSplashScreen()
    }, 6000)
    // this.player.presentFullscreenPlayer()
    // setTimeout(() => this.player.seek(99999), 50)
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
