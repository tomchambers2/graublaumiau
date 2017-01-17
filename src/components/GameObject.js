import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native'

import gameObjects from '../data/gameObjects'

import gameObjectImage from '../assets/game/game_move_back.png'

import menuBackground from '../assets/game/game_move_back.png'
import upIcon from '../assets/game/game_move_up_top.png'
import deleteIcon from '../assets/game/game_move_delet_top.png'
import downIcon from '../assets/game/game_move_down_top.png'

const window = Dimensions.get('window')

class Game extends Component {
  static propTypes = {
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

    const didMove = ({ moveX, moveY, dx, dy }) => {
      return (dx > 30 || dy > 30)
    }

    this.lastMovement = {
      x: 0,
      y: 0,
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => (e, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        // console.log('movement total', gestureState.moveX , gestureState.moveY)
        // console.log('acutal move from corner', e.nativeEvent.locationX,e.nativeEvent.locationY)

        // first param should be this.props.id
        this.props.moveObject(0, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
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
      }
    })

    this.state = {
      menuOpen: false,
      width: 300,
      height: 300,
    }
  }

  _resize() {

  }

  _deleteSelf() {
    this.props.deleteObject(this.props.id)
  }

  _toggleMenu = () => {
    console.log('toggling menu')
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  }

  _sendToFront() {
      const zIndexRange = this.props.getZIndexRange()
      this.setState({
        zIndex: zIndexRange[1] + 1,
      })
  }

  _sendToBack() {
      const zIndexRange = this.props.getZIndexRange()
      this.setState({
        zIndex: zIndexRange[0] - 1,
      })
  }

  _moveSelf = () => {

  }

  render() {
    // const gameObjectImage = gameObjects[this.props.id].image

    const menu = this.state.menuOpen ? (
      <Image source={menuBackground} style={styles.menu}>
        <Image source={upIcon} onPress={this._sendToFront}></Image>
        <Image source={deleteIcon} onPress={this._deleteSelf}></Image>
        <Image source={downIcon} onPress={this._sendToBack}></Image>
      </Image>
    ) : null

    return (
      <View {...this.panResponder.panHandlers} style={[ styles.gameObject, { top: this.props.y, left: this.props.x } ]}>
        {menu}
        <TouchableHighlight onLongPress={this._toggleMenu}>
          <Image source={gameObjectImage} style={[styles.inner, { width: this.state.width, height: this.state.height }]} />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pan: {
    backgroundColor: 'blue'
  },
  gameObject: {
    position: 'absolute',
    backgroundColor: 'black',
    width: 100,
    height: 100,
  },
  inner: {
    backgroundColor: 'green'
  },
  menu: {
    position: 'absolute',
    zIndex: 10,
  }
})

export default Game
