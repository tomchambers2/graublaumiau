import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native'

import NavigationButton from './NavigationButton'

import dialogBackground from '../assets/navigation/warning_background.png'
import dialogText from '../assets/navigation/warning_text-send.png'
import dialogConfirm from '../assets/navigation/warning_yes.png'
import dialogCancel from '../assets/navigation/warning_no.png'

const window = Dimensions.get('window')

class EmailDialog extends Component {
  render() {
    return (
      <View
        style={[styles.menuDialogContainer]}>
        <Image
          style={styles.menuDialog}
          source={dialogBackground}>
          <Image source={dialogText} />
          <View style={styles.buttonRow}>
            <NavigationButton onPress={this.props.sendEmail}>
              <Image source={dialogConfirm}></Image>
            </NavigationButton>
            <NavigationButton onPress={this.props.cancelDialog}>
              <Image source={dialogCancel}></Image>
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
    // backgroundColor: 'yellow',
    zIndex: 1000,
    height: window.height,
    width: window.width - 150,
    marginLeft: 150,
    alignItems: 'center',
    justifyContent: 'center',
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

export default EmailDialog
