import React, { Component, PropTypes } from 'react'

import Sound from 'react-native-sound'

class BackgroundSound extends Component {
    static propTypes = {
        soundOn: PropTypes.bool.isRequired,
        playing: PropTypes.bool.isRequired,
    }

    componentDidMount() {
        this.bg = new Sound('main-background-sound.mp3', Sound.MAIN_BUNDLE, () => {
          if (!this.props.soundOn) {
            this.bg.setVolume(0)
          }
          this.bg.setNumberOfLoops(-1)
          if (this.props.playing) {
              this.bg.play()
          }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.soundOn) {
            this.bg.setVolume(1)
        } else {
            this.bg.setVolume(0)
        }

        if (nextProps.playing) {
            this.bg.play()
        } else {
            this.bg.pause()
        }
    }

    render() {
        return null
    }
}

export default BackgroundSound
