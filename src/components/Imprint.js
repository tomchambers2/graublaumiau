import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native'

import NavigationButton from './NavigationButton'

import background from '../assets/imprint/background.png'
import backButton from '../assets/imprint/back.png'

import globalStyles from '../globalStyles'

class Imprint extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
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
})

export default Imprint
