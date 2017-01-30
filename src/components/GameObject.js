import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  PanResponder,
} from 'react-native'

import gameObjects from '../assets/game_objects/'

import NavigationButton from './NavigationButton'

import menuBackground from '../assets/game/menu_background.png'
import upIcon from '../assets/game/up.png'
import deleteIcon from '../assets/game/delete.png'
import downIcon from '../assets/game/down.png'

class Game extends Component {
  static propTypes = {
    index: PropTypes.number.required,
    getZIndexRange: PropTypes.func.required,
    moveObject: PropTypes.func.required,
    deleteObject: PropTypes.func.required,
    id: PropTypes.number.isRequired,
    gameObjectId: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }

  constructor() {
    super()

    this.lastMovement = {
      x: 0,
      y: 0,
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => (e, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        this.props.moveObject(this.props.index, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
        this.lastMovement = {
          x: gestureState.dx,
          y: gestureState.dy,
        }
      },
      onPanResponderRelease: () => {
        this.lastMovement = {
          x: 0,
          y: 0,
        }
      },
    })

    this.state = {
      menuOpen: false,
      width: 300,
      height: 300,
    }
  }

  _resize() {

  }

  _deleteSelf = () => {
    this.props.deleteObject(this.props.index)
  }

  _toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _sendToFront = () => {
    this.props.sendToFront(this.props.index)
  }

  _sendToBack = () => {
    this.props.sendToBack(this.props.index)
  }

  _moveSelf = () => {

  }

  render() {
    const gameObject = gameObjects.find((gameObject) => gameObject.gid === this.props.id)
    const gameObjectImage = gameObject.animation || gameObject.image

    const menu = this.state.menuOpen ? (
      <Image source={menuBackground} style={styles.menu}>
        <NavigationButton onPress={this._sendToFront}>
          <Image source={upIcon}></Image>
        </NavigationButton>
        <NavigationButton onPress={this._deleteSelf}>
          <Image source={deleteIcon}></Image>
        </NavigationButton>
        <NavigationButton onPress={this._sendToBack}>
          <Image source={downIcon}></Image>
        </NavigationButton>
      </Image>
    ) : null

    return (
      <View
        {...this.panResponder.panHandlers}
        style={[ styles.gameObject, { top: this.props.y, left: this.props.x } ]}>
        {menu}
        <TouchableHighlight
          onLongPress={this._toggleMenu}>
          <Image
            resizeMode={Image.resizeMode.contain}
            source={gameObjectImage}
            style={[styles.inner, { width: this.state.width, height: this.state.height }]} />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  gameObject: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  menu: {
    position: 'absolute',
    zIndex: 1000,
  },
})

export default Game
