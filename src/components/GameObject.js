import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  PanResponder,
  Text,
  Animated,
  ScrollView,
} from 'react-native'

import ImageSequence from 'react-native-image-sequence';

import ZoomableImage from './ZoomableImage'
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

    this.dragging = true

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt) => {
        if (evt.nativeEvent.touches.length > 1) {
          return false
        }
        return true
      },
      // onMoveShouldSetPanResponder: () => (e, gestureState) => true,
      onPanResponderGrant: () => {
        this.dragging = true
        return true
      },
      onPanResponderMove: (e, gestureState) => {
        this.props.moveObject(this.props.index, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
        this.lastMovement = {
          x: gestureState.dx,
          y: gestureState.dy,
        }
      },
      onPanResponderRelease: () => {
        this.setState({
          dragging: false,
        })
        this.dragging = false
        this.props.constrainObject(this.props.index)
        this.lastMovement = {
          x: 0,
          y: 0,
        }
      },
    })

    this.state = {
      menuOpen: false,
      width: 201,
      height: 300,
      disabled: true,
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
    this._toggleMenu()
  }

  _sendToBack = () => {
    this.props.sendToBack(this.props.index)
    this._toggleMenu()
  }

  componentWillMount() {
    this.setState({
      top: new Animated.Value(this.props.y),
      left: new Animated.Value(this.props.x),
    })

    this.gameObject = this.props.gameObjects.find((gameObject) => gameObject.gid === this.props.gameObjectId)
    this.gameObjectImage = this.gameObject.image
  }

  _playAnimation = () => {
    this.setState({
      disabled: false,
    })

    //play sound here

    setTimeout(() => {
      this.setState({
        disabled: true,
      })

      setTimeout(() => {
        this._playAnimation()
      }, 12000)
    }, 3000)
  }

  componentWillReceiveProps(newProps) {
    if (!this.init && !newProps.dragging) {
      this.dragging = newProps.dragging
      this.init = true
      this._playAnimation()
    }
    if (this.dragging) {
      this.state.top.setValue(newProps.y)
      this.state.left.setValue(newProps.x)
    } else {
      Animated.timing(
        this.state.top,
        { toValue: newProps.y, duration: 350 }
      ).start()
      Animated.timing(
        this.state.left,
        { toValue: newProps.x, duration: 350 }
      ).start()
    }
  }

  render() {
    const menu = this.state.menuOpen ? (
      <NavigationButton
        onPress={this._toggleMenu}
        style={[styles.menuContainer, { width: this.state.width, height: this.state.height }]}>
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
      </NavigationButton>
    ) : null

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[ styles.gameObject, { top: this.state.top, left: this.state.left, width: this.state.width, height: this.state.height } ]}>
        {menu}
        {/* <Text>width: {this.state.width}, height: {this.state.height}</Text> */}
        <TouchableHighlight
          underlayColor="rgba(255,255,255,0)"
          onLongPress={this._toggleMenu}>

          <View>
            <Text>Paused: {this.state.disabled && 'true' || 'false'}</Text>
            <ZoomableImage
              source={this.gameObject.image}
              sequence={this.gameObject.sequence}
              sequencePaused={this.state.disabled}
              sequenceDisabled={!this.init}
              // was this.props.dragging
              imageWidth={200}
              imageHeight={300}
              style={[styles.inner, { width: this.state.width, height: this.state.height }]} />
          </View>
        </TouchableHighlight>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  inner: {
    // backgroundColor: 'green'
  },
  icon: {
    marginTop: 18,
    marginLeft: 12,
  },
  menuContainer: {
    position: 'absolute',
    zIndex: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    marginTop: 18,
    marginLeft: 14,
  },
  gameObject: {
    position: 'absolute',
    // backgroundColor: 'yellow'
  },
})

export default Game
