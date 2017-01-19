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

import menuBackground from '../assets/game/game_move_back.png'
import upIcon from '../assets/game/game_move_up_top.png'
import deleteIcon from '../assets/game/game_move_delet_top.png'
import downIcon from '../assets/game/game_move_down_top.png'

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
    console.log('deleting self')
    this.props.deleteObject(this.props.index)
  }

  _toggleMenu = () => {
    console.log('menu toggled for ', this.props.index)
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _sendToFront = () => {
    console.log('front self')
    this.props.sendToFront(this.props.index)
  }

  _sendToBack = () => {
    console.log('back self')
    this.props.sendToBack(this.props.index)
  }

  _moveSelf = () => {

  }

  render() {
    const gameObject = gameObjects.find((gameObject) => gameObject.gid === this.props.id)
    console.log(gameObject, this.props.id)
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
