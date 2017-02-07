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

import Sound from 'react-native-sound';

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

    this.lastShouldCloseMenu = false

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (evt) => {
        if (evt.nativeEvent.touches.length > 1) {
          return false
        }
        return true
      },
      onPanResponderGrant: () => {
        console.log("HIT OBJECT")
        this.props.allowOpen()
        this.wasLongPresssed = false
        if (!this.state.menuOpen) {
          this.objectPressTimer = setTimeout(() => {
            this.wasLongPresssed = true
            this._toggleMenu()
          }, 400)
        }
        this.dragging = true
      },
      onPanResponderMove: (e, gestureState) => {
        clearTimeout(this.objectPressTimer)
        this.props.moveObject(this.props.index, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
        this.lastMovement = {
          x: gestureState.dx,
          y: gestureState.dy,
        }
      },
      onPanResponderRelease: () => {
        if (!this.wasLongPresssed) {
          this.props.closeAllMenus()
        }
        clearTimeout(this.objectPressTimer)
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
    console.log('delete self')
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

    this.sound = new Sound(this.props.data.soundName, Sound.MAIN_BUNDLE, (err) => {
      console.log(err)
    })
  }

  _playAnimation = () => {
    this.setState({
      disabled: false,
    })

    if (this.props.soundOn) {
      this.sound.play()
    }

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
    if (newProps.shouldCloseMenu) {
      console.log('do close')
      this.setState({
        menuOpen: false,
      })
      this.lastShouldCloseMenu = true
    }

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
      <TouchableHighlight onPress={this._toggleMenu}
        style={[styles.menuContainer, { width: this.state.width, height: this.state.height }]}>
          <View>
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
      </TouchableHighlight>
    ) : null

    return (
      <Animated.View
        style={[ styles.gameObject, { top: this.state.top, left: this.state.left, width: this.state.width, height: this.state.height } ]}>
        {menu}
        <View
          {...this.panResponder.panHandlers}>
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
    // backgroundColor: 'blue'
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
