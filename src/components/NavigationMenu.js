import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
} from 'react-native'

import NavigationButton from './NavigationButton'
import MenuDialog from './MenuDialog'

import hamburger from '../assets/navigation/hamburger.png'
import menuBackgroundClosed from '../assets/navigation/hamburger_closed.png'
import menuBackgroundOpenLarge from '../assets/navigation/background_large.png'
import menuBackgroundOpenSmall from '../assets/navigation/background.png'

import menuIcon from '../assets/navigation/menu.png'
import soundOffIcon from '../assets/navigation/sound_off.png'
import soundOnIcon from '../assets/navigation/sound_on.png'
import mailIcon from '../assets/navigation/mail.png'

class NavigationMenu extends Component {
  static propTypes = {
    toggleSound: PropTypes.func.isRequired,
    soundOn: PropTypes.bool.isRequired,
    goToMenu: PropTypes.func.isRequired,
    showMailDialog: PropTypes.func.isRequired,
    full: PropTypes.bool,
  }

  constructor() {
    super()
    this.state = {
      menuOpen: false,
      menuDialogOpen: false,
    }
  }

  _toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _openMailDialog() {

  }

  _openMenuDialog = () => {
    this.setState({
      menuDialogOpen: true,
    })
  }

  _cancelMenuDialog = () => {
    this.setState({
      menuDialogOpen: false,
    })
  }

  componentWillMount() {
    this._slideValue = new Animated.Value(0)
  }

  render() {
    const menuBackgroundOpen = this.props.full ? menuBackgroundOpenLarge : menuBackgroundOpenSmall
    const menuBackgroundSelected = this.state.menuOpen ? menuBackgroundOpen : menuBackgroundClosed
    const soundToggleIcon = this.props.soundOn ? soundOnIcon : soundOffIcon
    const mailButton = (
    <NavigationButton style={styles.mailIcon} onPress={this.props.showMailDialog}>
      <Image source={mailIcon} />
    </NavigationButton>
    )
    const menuIcons = (
      <View style={styles.innerMenu}>
        <NavigationButton onPress={this.props.toggleSound} style={styles.soundToggleIcon}>
          <Image source={soundToggleIcon} />
        </NavigationButton>
        {this.props.full && mailButton}
        <NavigationButton onPress={this._openMenuDialog} style={styles.menuIcon}>
          <Image source={menuIcon} />
        </NavigationButton>
      </View>
    )

    const menuOpenIcons = this.state.menuOpen ? menuIcons : null
    const menuDialogContent = (
      <MenuDialog
        game={this.props.full}
        goToMenu={this.props.goToMenu}
        cancelDialog={this._cancelMenuDialog}
        />
    )
    const closeDialog = this.state.menuDialogOpen ? menuDialogContent : null

    return (
      <View>
        {closeDialog}
        <View style={styles.menuContainer}>
          <View style={styles.absolute}>
            <Image source={menuBackgroundSelected}>
              <View style={styles.menuBackground}>
                <NavigationButton onPress={this._toggleMenu}>
                  <Image
                    style={styles.hamburger}
                    source={hamburger}>
                  </Image>
                </NavigationButton>
                {menuOpenIcons}
              </View>
            </Image>
          </View>
        </View>
      </View>
    )
  }
}

export default NavigationMenu

const styles = StyleSheet.create({
  hamburger: {
    marginTop: 15,
    marginLeft: 9,
  },
  menuContainer: {
    height: 49,
    zIndex: 50,
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
  menuBackground: {
    flexDirection: 'row',
    flex: 1,
    height: 300,
  },
  innerMenu: {
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
