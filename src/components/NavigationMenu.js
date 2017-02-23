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
    showMailDialog: PropTypes.func,
    full: PropTypes.bool,
  }

  static defaultProps = {
      showMailDialog: null,
      full: false,
  }

  constructor() {
    super()
    this.state = {
      menuOpen: false,
      menuDialogOpen: false,
    }
  }

  componentWillMount() {
    this._slideValue = new Animated.Value(0)
  }

  _toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _openMenuDialog = () => {
    this.setState({
      menuDialogOpen: true,
    })
    this.props.toggleOverlay && this.props.toggleOverlay()
  }

  _cancelMenuDialog = () => {
    this.setState({
      menuDialogOpen: false,
    })
    this.props.toggleOverlay && this.props.toggleOverlay()
  }

  render() {
    const menuBackgroundOpen = this.props.full ? menuBackgroundOpenLarge : menuBackgroundOpenSmall
    const menuBackgroundSelected = this.state.menuOpen ? menuBackgroundOpen : menuBackgroundClosed
    const soundToggleIcon = this.props.soundOn ? soundOnIcon : soundOffIcon
    const mailButton = this.props.showMailDialog && (
        <NavigationButton
            onPress={this.props.showMailDialog}
            style={styles.mailIcon}
        >
            <Image source={mailIcon} />
        </NavigationButton>
    )
    const menuIcons = (
        <View style={styles.innerMenu}>
            <NavigationButton
                onPress={this.props.toggleSound}
                style={styles.soundToggleIcon}
            >
                <Image source={soundToggleIcon} />
            </NavigationButton>
            {mailButton}
            <NavigationButton
                onPress={this._openMenuDialog}
                style={styles.menuIcon}
            >
                <Image source={menuIcon} />
            </NavigationButton>
        </View>
    )

    const menuOpenIcons = this.state.menuOpen ? menuIcons : null
    const menuDialogContent = (
        <MenuDialog
            cancelDialog={this._cancelMenuDialog}
            game={this.props.full}
            goToMenu={this.props.goToMenu}
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
                            <NavigationButton
                                onPress={this._toggleMenu}
                            >
                                <Image
                                    source={hamburger}
                                    style={styles.hamburger}
                                />
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
  soundToggleIcon: {
    width: 50,
  },
  hamburger: {
    marginTop: 15,
    marginLeft: 9,
  },
  menuContainer: {
    height: 49,
    zIndex: 200,
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
