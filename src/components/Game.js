import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'

import { createResponder as customResponder } from 'react-native-gesture-responder';

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
        console.log(event.nativeEvent)
        // ReactNativeComponentTree.getInstanceFromNode(event.native);

        const x = event.nativeEvent.pageX
        const y = event.nativeEvent.pageY
        this.setState({
          gameObjectInstances: this.state.gameObjectInstances.concat({ id: this.instanceCounter, gameObjectId: 0, x: x - 300, y: y - 100, width: 300, height: 300, dragging: true }),
          // gameObjectInstances: this.state.gameObjectInstances.concat({ id: 0, x, y }),
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

  _sendEmail() {
    email.send(this._playArea)
  }

  _constrainToGrid(x, y, shapeDimensions) {
    if (x < 0) x = 0
    if (x + (shapeDimensions.width + 180) > window.width) x = window.width - shapeDimensions.width - 180
    if (y < 0) y = 0
    if (y + shapeDimensions.height > window.height) y = window.height - shapeDimensions.height
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
    console.log('old data',data)
    const newData = update(data, {
      $splice: [[index, 1]],
    })
    console.log('new data', newData)
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

  componentWillReceiveProps(newProps) {
    if (!newProps.soundOn) {
      // turn sound off
    } else {
      // turn sound on
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
        <View style={styles.playArea} ref={component => this._playArea = component}>
          {renderGameObjectInstances}
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
