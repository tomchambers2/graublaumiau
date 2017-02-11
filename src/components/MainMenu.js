import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native'

import SoundOn from '../assets/menu/sound_on.png'
import SoundOff from '../assets/menu/sound_off.png'
import Background from '../assets/menu/background.png'
import imprintButton from '../assets/menu/imprint.png'
import storyButton from '../assets/menu/story.png'
import gameButton from '../assets/menu/game.png'

import NavigationButton from './NavigationButton'

import globalStyles from '../globalStyles'

class MainMenu extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    soundOn: PropTypes.bool.isRequired,
    toggleSound: PropTypes.func.isRequired,
    playBackgroundSound: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.playBackgroundSound()
  }

  goToPage = (id) => {
    return () => {
        const route = {
            id,
        }
        this.props.navigator.push(route);
    }
  }

  goToImprint = this.goToPage('Imprint')
  goToStory = this.goToPage('Story')
  goToGame = this.goToPage('Game')

  render() {
    const soundToggle = this.props.soundOn ? SoundOn : SoundOff

    return (
        <Image
            resizeMode={Image.resizeMode.cover}
            source={Background}
            style={globalStyles.fullscreen}
        >
            <View style={styles.interactionContainer}>
                <View style={styles.buttonRow}>
                    <NavigationButton
                        activeOpacity={0.7}
                        onPress={this.props.toggleSound}
                        style={styles.soundButton}
                        underlayColor="rgba(255,255,255,0)"
                    >
                        <Image
                            resizeMode={Image.resizeMode.contain}
                            source={soundToggle}
                            style={styles.soundButtonImage}
                        />
                    </NavigationButton>

                    <NavigationButton
                        onPress={this.goToImprint}
                        style={styles.imprintButton}
                    >
                        <Image
                            source={imprintButton}
                            style={styles.imprintButtonImage}
                        />
                    </NavigationButton>
                </View>

                <View style={styles.spacer} />

                <View style={[styles.buttonRow, styles.bottomButtons]}>
                    <NavigationButton
                        onPress={this.goToStory}
                    >
                        <Image source={storyButton} />
                    </NavigationButton>

                    <NavigationButton
                        onPress={this.goToGame}
                    >
                        <Image source={gameButton} />
                    </NavigationButton>
                </View>
            </View>
        </Image>
    )
  }
}

export default MainMenu

const styles = StyleSheet.create({
  interactionContainer: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 20,
    marginRight: 30,
    marginLeft: 30,
    justifyContent: 'space-between',
    paddingBottom: 44,
  },
  bottomButtons: {
    alignItems: 'flex-end',
  },
  soundButton: {
    width: 50,
    height: 50,
    borderRadius: 9999,
  },
  soundButtonImage: {
    height: 50,
    width: 50,
  },
  imprintButtonImage: {
    flex: 1,
  },
  imprintButton: {
    height: 49,
    width: 164,
  },
})
