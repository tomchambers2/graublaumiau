import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native'

import NavigationButton from './NavigationButton'

import dialogBackground from '../assets/story/story_warning_back.png'
import dialogText from '../assets/story/story_warning_text_top.png'
import dialogConfirmBackground from '../assets/story/story_warning_yes_back.png'
import dialogConfirm from '../assets/story/story_warning_yes_top.png'
import dialogCancelBackground from '../assets/story/story_warning_no_back.png'
import dialogCancel from '../assets/story/story_warning_no_top.png'

const window = Dimensions.get('window')

class MenuDialog extends Component {
  render() {
    return (
      <View
        style={[styles.menuDialogContainer, this.props.game && styles.gameShift]}>
        <Image
          style={styles.menuDialog}
          source={dialogBackground}>
          <Image source={dialogText} />
          <View style={styles.buttonRow}>
            <NavigationButton onPress={this.props.goToMenu}>
              <Image source={dialogConfirmBackground}>
                <Image source={dialogConfirm}></Image>
              </Image>
            </NavigationButton>
            <NavigationButton onPress={this.props.cancelDialog}>
              <Image source={dialogCancelBackground}>
                <Image source={dialogCancel}></Image>
              </Image>
            </NavigationButton>
          </View>
        </Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuDialogContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    height: window.height,
    width: window.width,
    marginLeft: -30,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameShift: {
    width: window.width - 150,
  },
  menuDialog: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 30,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
  },
})

export default MenuDialog
