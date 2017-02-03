import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'

import { Alert } from 'react-native'

import Sound from 'react-native-sound';

import email from '../api/email'

import EmailDialog from './EmailDialog'

const window = Dimensions.get('window')

import update from 'immutability-helper';

import NavigationMenu from './NavigationMenu'
import GameObject from './GameObject'

import colors from '../colors'

import gameObjects from '../assets/game_objects/'

import dividerImage from '../assets/game/game_line.png'

class Game extends Component {
  static propTypes = {
    toggleSound: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
    soundOn: React.PropTypes.bool.isRequired,
  }

  constructor() {
    super()

    this.state = {
      scrollEnabled: true,
      gameObjectInstances: [],
      sendDialogOpen: false,
    }

    this.lastMovement = {
      x: 0,
      y: 0,
    }

    this.instanceCounter = 0

    this.createResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const x = event.nativeEvent.pageX
        const y = event.nativeEvent.pageY

        // todo: set width and height from data

        // todo: set limit correctly
        if (this.state.gameObjectInstances.length >= 9) {
          Alert.alert('Animation limit', 'The maximum number of animations in the game is 9')
          return
        }

        this.setState({
          gameObjectInstances: this.state.gameObjectInstances.concat({ id: this.instanceCounter, gameObjectId: 0, x: x - 300, y: y - 100, width: 201, height: 300, dragging: true }),
          scrollEnabled: false,
        })
        this.instanceCounter++
        this.lastMovement = {
          x: 0,
          y: 0,
        }
        return true
      },
      onPanResponderMove: (event, gestureState) => {
        const index = this.state.gameObjectInstances.length - 1
        this._moveObject(index, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
        this.lastMovement = {
          x: gestureState.dx,
          y: gestureState.dy,
        }
      },
      onPanResponderRelease: () => {
        this.setState({
          scrollEnabled: true,
        })
        const index = this.state.gameObjectInstances.length - 1
        this._constrainObject(index)
      },
    })
  }

  _goToMenu() {
    // bg.pause()
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  _sendEmail = () => {
    email.send(this._playArea, this._cancelEmailDialog)
  }

  _constrainToGrid(x, y, shapeDimensions) {
    const keepInMargin = 80
    const minX = -10 - shapeDimensions.width + keepInMargin
    const maxX = shapeDimensions.width + 165 - keepInMargin

    const minY = -shapeDimensions.height + keepInMargin
    const maxY = keepInMargin

    if (x < minX) x = minX
    if (x + maxX > window.width) x = window.width - maxX
    if (y < minY) y = minY
    if (y + maxY > window.height) y = window.height - maxY
    return [x, y]
  }

  _stopDragging = (index) => {
    const data = this.state.gameObjectInstances
    const updatedData = update(data[index], { dragging: { $set: false } })
    const newData = update(data, {
      $splice: [[index, 1, updatedData]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  _constrainObject = (index) => {
    const data = this.state.gameObjectInstances
    let {x, y, width, height} = data[index]
    let [constrainedX, constrainedY] = this._constrainToGrid(x, y, { width, height })
    const updatedData = update(data[index], { x: { $set: constrainedX }, y: { $set: constrainedY }, dragging: { $set: false } })
    const newData = update(data, {
      $splice: [[index, 1, updatedData]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  _moveObject = (index, x, y) => {
    const data = this.state.gameObjectInstances
    const newX = data[index].x + x
    const newY = data[index].y + y
    const updatedData = update(data[index], { x: { $set: newX }, y: { $set: newY } })
    const newData = update(data, {
      $splice: [[index, 1, updatedData]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  _deleteObject = (index) => {
    const data = this.state.gameObjectInstances
    const newData = update(data, {
      $splice: [[index, 1]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  _sendToBack = (index) => {
    const data = this.state.gameObjectInstances
    let newData = update(data, {
      $splice: [[index, 1]],
    })
    newData = update(newData, {
      $unshift: [data[index]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  _sendToFront = (index) => {
    const data = this.state.gameObjectInstances
    let newData = update(data, {
      $splice: [[index, 1]],
    })
    newData = update(newData, {
      $push: [data[index]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  _openEmailDialog = () => {
    this.setState({
      sendDialogOpen: true,
    })
  }

  _cancelEmailDialog = () => {
    this.setState({
      sendDialogOpen: false,
    })
  }

  componentDidMount() {
    this.bg = new Sound('main_sound.mp3', Sound.MAIN_BUNDLE, () => {
      if (!this.props.soundOn) {
        this.bg.setVolume(0)
      }
      this.bg.setNumberOfLoops(-1)
      this.bg.play()
    })
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.soundOn) {
      this.bg.setVolume(0)
    } else {
      this.bg.setVolume(1)
    }
  }

  render() {
    const renderGameObjects = gameObjects.map((gameObject, i) => {
      return (
        <View
          style={styles.placeholder}
          {...this.createResponder.panHandlers}>
            <Image style={{ height: 150 }} resizeMode={Image.resizeMode.contain} source={gameObject.image} />
        </View>
      )
    })

    const renderGameObjectInstances = this.state.gameObjectInstances.map((gameObject, i) => {
        return (<GameObject
          gameObjectId={gameObject.gameObjectId}
          key={gameObject.id}
          index={i}
          gameObjects={gameObjects}
          {...gameObject}
          constrainObject={this._constrainObject}
          sendToFront={this._sendToFront}
          sendToBack={this._sendToBack}
          deleteObject={this._deleteObject}
          moveObject={this._moveObject}
          />)
    })

    const sendEmailDialog = this.state.sendDialogOpen ? (
      <EmailDialog
        sendEmail={this._sendEmail}
        cancelDialog={this._cancelEmailDialog} />)
      : null

    return (
      <View style={styles.gameContainer}>
        {sendEmailDialog}
        <View style={styles.objectMenu}>
          <ScrollView scrollEnabled={this.state.scrollEnabled}>
            {renderGameObjects}
          </ScrollView>
        </View>
        <View style={styles.divider}>
          <Image
            style={styles.dividerImage}
            resizeMode={Image.resizeMode.contain}
            source={dividerImage}>
          </Image>
        </View>
        <View style={styles.playArea}>
          <View ref={(component) => { this._playArea = component }} style={styles.playArea}>
            {renderGameObjectInstances}
          </View>
          <View style={styles.navBar}>
            <NavigationMenu
              full
              toggleSound={this.props.toggleSound}
              soundOn={this.props.soundOn}
              showMailDialog={this._openEmailDialog}
              goToMenu={this._goToMenu.bind(this)} />
          </View>
        </View>
      </View>
    )
  }
}

export default Game

const styles = StyleSheet.create({
  navBar: {
    marginTop: 20,
    marginLeft: 17,
    position: 'absolute',
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  objectMenu: {
    width: 150,
    maxWidth: 150,
    backgroundColor: colors.objectMenu,
    flex: 1,
    alignItems: 'center',
  },
  playArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  divider: {
    flex: 1,
    maxWidth: 26,
    marginLeft: -12,
  },
  dividerImage: {
    flex: 1,
  },
  placeholder: {
    marginTop: 15,
    marginBottom: 15,
    width: 120,
    height: 150,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
