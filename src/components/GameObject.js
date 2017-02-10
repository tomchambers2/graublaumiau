import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native'

import ZoomableImage from './ZoomableImage'
import NavigationButton from './NavigationButton'

import menuBackground from '../assets/game/menu_background.png'
import upIcon from '../assets/game/up.png'
import deleteIcon from '../assets/game/delete.png'
import downIcon from '../assets/game/down.png'

import Sound from 'react-native-sound';

class Game extends Component {
  static propTypes = {
    allowOpen: PropTypes.func.isRequired,
    closeAllMenus: PropTypes.func.isRequired,
    constrainObject: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    deleteObject: PropTypes.func.isRequired,
    sendToFront: PropTypes.func.isRequired,
    sendToBack: PropTypes.func.isRequired,
    gameObjects: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    moveObject: PropTypes.func.isRequired,
    soundOn: PropTypes.bool.isRequired,
    gameObjectId: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }

  static defaultProps = {
      allowOpen: true,
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
      onStartShouldSetPanResponderCapture: (evt) => {
        if (evt.nativeEvent.touches.length > 1) {
          return false
        }
        return true
      },
      onMoveShouldSetPanResponder: (evt) => {
        if (evt.nativeEvent.touches.length > 1) {
          return false
        }
        return true
      },
      onPanResponderGrant: () => {
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

  componentWillMount() {
    this.setState({
      top: new Animated.Value(this.props.y),
      left: new Animated.Value(this.props.x),
    })

    this.gameObject = this.props.gameObjects.find((gameObject) => gameObject.gid === this.props.gameObjectId)
    this.gameObjectImage = this.gameObject.image

    this.sound = new Sound(this.props.data.soundName, Sound.MAIN_BUNDLE, (err) => {
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.shouldCloseMenu) {
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

  render() {
    const menu = this.state.menuOpen ? (
        <TouchableHighlight
            onPress={this._toggleMenu}
            underlayColor='transparent'
            style={[styles.menuContainer, { width: this.state.width, height: this.state.height }]}
        >
            <View>
                <Image source={menuBackground}
                    style={styles.menuInner}
                >
                    <NavigationButton
                        onPress={this._sendToFront}
                        style={styles.icon}
                    >
                        <Image source={upIcon} />
                    </NavigationButton>
                    <NavigationButton
                        onPress={this._deleteSelf}
                        style={styles.delete}
                    >
                        <Image source={deleteIcon} />
                    </NavigationButton>
                    <NavigationButton
                        onPress={this._sendToBack}
                        style={styles.icon}
                    >
                        <Image source={downIcon} />
                    </NavigationButton>
                </Image>
            </View>
        </TouchableHighlight>
    ) : null

    return (
        <Animated.View
            style={[ styles.gameObject, { top: this.state.top, left: this.state.left, width: this.state.width, height: this.state.height } ]}
        >
            {menu}
            <View {...this.panResponder.panHandlers}>
                <ZoomableImage
                    imageHeight={300}
                    imageWidth={200}
                    sequence={this.gameObject.sequence}
                    sequenceDisabled={!this.init}
                    sequencePaused={this.state.disabled}
                    source={this.gameObject.image}
                    style={[styles.inner, { width: this.state.width, height: this.state.height }]}
                />
            </View>
        </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
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
  },
})

export default Game
