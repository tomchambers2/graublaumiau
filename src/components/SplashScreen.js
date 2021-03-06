import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
} from 'react-native'

import Video from 'react-native-video'
import loadingVideo from '../assets/loadingVideo.mp4'

class SplashScreen extends Component {
    static propTypes = {
        hideSplashScreen: PropTypes.func.isRequired,
    }

    componentDidMount() {
      setTimeout(() => {
        this.props.hideSplashScreen()
      }, 6500)
    }

    assignRef = ref => this.player = ref

    render() {
        return (
            <Video
                muted
                ref={this.assignRef}
                repeat={true}
                resizeMode="cover"
                source={loadingVideo}
                style={styles.backgroundVideo}
            />
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
  },
})

export default SplashScreen
