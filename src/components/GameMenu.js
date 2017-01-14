import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableHighlight,
  PanResponder,
  Animated,
  Dimensions,
  Image,
  ScrollView
} from 'react-native'

import menuToggle from '../assets/game/game_menu_close-open_top.png'
import menuBackgroundClosed from '../assets/game/game_menu_close_back.png'
import menuBackgroundOpen from '../assets/game/game_menu_open_back.png'

import menuIcon from '../assets/game/game_menu_open_toMain_top.png'
import soundOffIcon from '../assets/game/game_menu_open_sound_off_top.png'
import soundOnIcon from '../assets/game/game_menu_open_sound_on_top.png'
import mailIcon from '../assets/game/game_menu_open_send.png'

class GameMenu extends Component {
  constructor() {
    super()

    this.state = {
      menuOpen: true,
      soundOn: true,
    }
  }

  componentWillMount() {
    this._slideValue = new Animated.Value(0)
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

  _toggleSound() {
    this.setState({
      soundOn: !this.state.soundOn,
    })
  }

  render() {
    const menuBackgroundSelected = this.state.menuOpen ? menuBackgroundOpen : menuBackgroundClosed
    const soundToggleIcon = this.state.soundOn ? soundOffIcon : soundOnIcon
console.log(menuOpenIcons)
    const menuIcons = (
      <View style={styles.innerMenu}>
        <TouchableHighlight onPress={this._toggleSound.bind(this)} style={styles.soundToggleIcon}>
          <Image source={soundToggleIcon} />
        </TouchableHighlight>
        <TouchableHighlight style={styles.mailIcon}>
          <Image source={mailIcon} />
        </TouchableHighlight>
        <TouchableHighlight style={styles.menuIcon}>
          <Image source={menuIcon} />
        </TouchableHighlight>
      </View>
    )

    const menuOpenIcons = this.state.menuOpen ? menuIcons : null

    return (
      <View style={styles.menuContainer}>
        <Image source={menuBackgroundSelected}>
          <View style={styles.menuBackground}>
            <TouchableHighlight onPress={this._toggleMenu.bind(this)}>
              <Image
                source={menuToggle}>
              </Image>
            </TouchableHighlight>
            {menuOpenIcons}
          </View>
        </Image>
      </View>
    )
  }
}

export default GameMenu

const styles = StyleSheet.create({
  menuContainer: {

  },
  menuBackground: {
    flexDirection: 'row',
    flex: 1,
    height: 300
  },
  innerMenu: {
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soundIcon: {
    marginTop: 20
  }
})
