import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native'

import NavigationButton from './NavigationButton'

import background from '../assets/imprint/imprint_text_picture.png'
import buttonBackground from '../assets/imprint/story_end_back.png'
import buttonText from '../assets/imprint/story_end_top.png'

import globalStyles from '../globalStyles'

class Imprint extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  _goBack = () => {
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  render() {
    return (
      <Image source={background} style={globalStyles.fullscreen} resizeMode={Image.resizeMode.cover}>
        <NavigationButton style={styles.backButton} onPress={this._goBack}>
          <Image source={buttonBackground}>
            <Image source={buttonText}></Image>
          </Image>
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
