import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
} from 'react-native'

import NavigationButton from './NavigationButton'

import menuToggle from '../assets/game/game_menu_close-open_top.png'
import menuBackgroundClosed from '../assets/game/game_menu_close_back.png'
import menuBackgroundOpenLarge from '../assets/game/game_menu_open_back.png'
import menuBackgroundOpenSmall from '../assets/story/story_menu_open_back.png'

import menuIcon from '../assets/game/game_menu_open_toMain_top.png'
import soundOffIcon from '../assets/game/game_menu_open_sound_off_top.png'
import soundOnIcon from '../assets/game/game_menu_open_sound_on_top.png'
import mailIcon from '../assets/game/game_menu_open_send.png'

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
    }
  }

  _toggleMenu() {
    Animated.timing(this._slideValue, {
      toValue: this.state.menuOpen ? -200 : 0,
      duration: 500,
    }).start()
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _openMailDialog() {

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
        <NavigationButton onPress={this.props.goToMenu} style={styles.menuIcon}>
          <Image source={menuIcon} />
        </NavigationButton>
      </View>
    )

    const menuOpenIcons = this.state.menuOpen ? menuIcons : null

    return (

        <View style={[styles.menuContainer,{ backgroundColor: 'white'}]}>
          <View style={styles.absolute}>
            <Image source={menuBackgroundSelected}>
              <View style={styles.menuBackground}>
                <NavigationButton onPress={this._toggleMenu.bind(this)}>
                  <Image
                    source={menuToggle}>
                  </Image>
                </NavigationButton>
                {menuOpenIcons}
              </View>
            </Image>
          </View>
        </View>
    )
  }
}

export default NavigationMenu

const styles = StyleSheet.create({
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
