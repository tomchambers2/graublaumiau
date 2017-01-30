import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  PanResponder,
  Text,
} from 'react-native'

import gameObjects from '../assets/game_objects/'

import NavigationButton from './NavigationButton'

import menuBackground from '../assets/game/menu_background.png'
import upIcon from '../assets/game/up.png'
import deleteIcon from '../assets/game/delete.png'
import downIcon from '../assets/game/down.png'

class Game extends Component {
  static propTypes = {
    // id: PropTypes.number.isRequired,
    // gameObjectId: PropTypes.number.isRequired,
    // x: PropTypes.number.isRequired,
    // y: PropTypes.number.isRequired,
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

  // _cacheViewDimensions = (event) => {
  //   const {width, height} = event.nativeEvent.layout
  //   console.log(width, height)
  //   this.setState({
  //     width: width,
  //     height: height,
  //   })
  // }

  render() {
    const gameObject = gameObjects.find((gameObject) => gameObject.gid === this.props.id)
    const gameObjectImage = gameObject.animation || gameObject.image

    const menu = this.state.menuOpen ? (
      <View style={[styles.menuContainer, { width: this.state.width, height: this.state.height }]}>
        <Image source={menuBackground} style={styles.menuInner}>
          <NavigationButton style={styles.icon} onPress={this._sendToFront}>
            <Image source={upIcon}></Image>
          </NavigationButton>
          <NavigationButton style={styles.delete} onPress={this._deleteSelf}>
            <Image source={deleteIcon}></Image>
          </NavigationButton>
          <NavigationButton style={styles.icon} onPress={this._sendToBack}>
            <Image source={downIcon}></Image>
          </NavigationButton>
        </Image>
      </View>
    ) : null

    return (
      <View
        {...this.panResponder.panHandlers}
        onLayout={this._cacheViewDimensions}
        style={[ styles.gameObject, { top: this.props.y, left: this.props.x } ]}>
        {menu}
        <TouchableHighlight
          underlayColor="rgba(255,255,255,0)"
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
  icon: {
    marginTop: 18,
    marginLeft: 12,
  },
  menuInner: {
    zIndex: 1000,
    position: 'absolute',
  },
  menuContainer: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green'
  },
  delete: {
    marginTop: 18,
    marginLeft: 14,
  },
  gameObject: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
})

export default Game
