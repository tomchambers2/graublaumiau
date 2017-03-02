import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  View,
} from 'react-native'

import NavigationButton from './NavigationButton'

import background from '../assets/imprint/background.png'
import backButton from '../assets/imprint/back.png'

import globalStyles from '../globalStyles'

const window = Dimensions.get('window')

class Imprint extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  goToWebsite = (url) => {
    return () => {
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }
  }

  handleGoBack = () => {
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  render() {
    return (
        <Image
            resizeMode={Image.resizeMode.cover}
            source={background}
            style={globalStyles.fullscreen}
        >
            <NavigationButton
                onPress={this.goToWebsite('http://alicekolb.ch/portfolio/')}
                style={styles.link}
              >
              <View></View>
            </NavigationButton>

            <NavigationButton
                onPress={this.goToWebsite('http://graublaumiau.ch/')}
                style={styles.link2}
              >
              <View></View>
            </NavigationButton>

            <NavigationButton
                onPress={this.handleGoBack}
                style={styles.backButton}
            >
                <Image source={backButton} />
            </NavigationButton>
        </Image>
    )
  }
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    right: 30,
    top: 20,
  },
  link: {
    position: 'absolute',
    zIndex: 100,
    width: 180,
    height: 60,
    top: 0.29 * window.width,
    left: 0.08 * window.height,
    // backgroundColor: 'yellow',
    // opacity: 0.3,
  },
  link2: {
    position: 'absolute',
    zIndex: 100,
    width: 220,
    height: 60,
    top: 0.36 * window.width,
    left: 0.08 * window.height,
    // backgroundColor: 'yellow',
    // opacity: 0.3,
  },
})

export default Imprint
