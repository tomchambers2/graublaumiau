function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
} from 'react-native'

import colors from '../colors'
import update from 'immutability-helper';
import { Alert } from 'react-native'

import email from '../api/email'
import EmailDialog from './EmailDialog'
import NavigationMenu from './NavigationMenu'
import GameObject from './GameObject'

import unshuffledGameObjects from '../assets/game_objects/'

const gameObjects = shuffle(unshuffledGameObjects)

import dividerImage from '../assets/game/game_line.png'

const window = Dimensions.get('window')

class Game extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    soundOn: React.PropTypes.bool,
    toggleSound: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
      soundOn: true,
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
    this.instanceCreated = false

    const panResponderStartHandler = () => true
    const panResponderGrantHandler = (index, gameObjectId) => {
      return (event) => {
        this._closeAllMenus()
        event.persist()
        this.objectPressTimer = setTimeout(() => {
          this.instanceCreated = true
          const x = event.nativeEvent.pageX
          const y = event.nativeEvent.pageY

          let animationsCount = 0;
          for (var i = 0; i < this.state.gameObjectInstances.length; i++) {
            if (this.state.gameObjectInstances[i].data.isAnimation) animationsCount++
          }
          if (animationsCount >= 9) {
            Alert.alert('Stopp!', 'Die Anzahl bewegter Bilder ist beschränkt auf maximal 9 Animationen.')
            return
          }

          const newGameObject = {
            id: this.instanceCounter,
            beingCreated: true,
            gameObjectId: gameObjectId,
            x: x - 300,
            y: y - 100,
            width: gameObjects[index].size.width,
            height: gameObjects[index].size.height,
            dragging: true,
            data: gameObjects[index],
          }
          this.setState({
            gameObjectInstances: this.state.gameObjectInstances.concat(newGameObject),
            scrollEnabled: false,
          })
          this.instanceCounter++
          this.lastMovement = {
            x: 0,
            y: 0,
          }
        }, 400)
      }
    }
    const panResponderMoveHandler = (event, gestureState) => {
      if (!this.instanceCreated) {
        clearTimeout(this.objectPressTimer)
        return false
      }
      const index = this.state.gameObjectInstances.length - 1
      this._moveObject(index, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
      this.lastMovement = {
        x: gestureState.dx,
        y: gestureState.dy,
      }
    }
    const panResponderReleaseHandler = () => {
      this.instanceCreated = false
      clearTimeout(this.objectPressTimer)
      this.setState({
        scrollEnabled: true,
      })
      const index = this.state.gameObjectInstances.length - 1
      this._constrainObject(index, true)
    }

    this.panResponders = []

    for (var i = 0; i < gameObjects.length; i++) {
      this.panResponders[gameObjects[i].gid] = PanResponder.create({
        onStartShouldSetPanResponder: panResponderStartHandler,
        onPanResponderGrant: panResponderGrantHandler(i, gameObjects[i].gid),
        onPanResponderMove: panResponderMoveHandler,
        onPanResponderRelease: panResponderReleaseHandler,
      })
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      soundOn: newProps.soundOn,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.closeAllMenus) {
      this.setState({
        closeAllMenus: false,
      })
    }
  }

  _goToMenu = () => {
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

  _constrainObject = (index) => {
    const data = this.state.gameObjectInstances
    let {x, y, width, height} = data[index]
    let [constrainedX, constrainedY] = this._constrainToGrid(x, y, { width, height })
    const updatedData = update(data[index],
        {
            x: { $set: constrainedX },
            y: { $set: constrainedY },
            dragging: { $set: false },
            beingCreated: { $set: false },
        })
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
      closeAllMenus: true,
    })
  }

  _closeAllMenus = () => {
    this.setState({
      closeAllMenus: true,
    })
  }

  _allowOpen = () => {
    this.setState({
      closeAllMenus: false,
    })
  }

  setRef = component => this._playArea = component

  render() {
    const renderGameObjects = gameObjects.map((gameObject, i) => {
      return (
          <View
              key={gameObject.gid}
              style={styles.placeholder}
              {...this.panResponders[gameObject.gid].panHandlers}
          >
              <Image
                  resizeMode={Image.resizeMode.contain}
                  source={gameObject.icon}
                  style={{ width: 120 }}
              >
              </Image>
          </View>
      )
    })

    const renderGameObjectInstances = this.state.gameObjectInstances.map((gameObject, i) => {
        if (gameObject.beingCreated) return
        return (
            <GameObject
                allowOpen={this._allowOpen}
                closeAllMenus={this._closeAllMenus}
                constrainObject={this._constrainObject}
                deleteObject={this._deleteObject}
                index={i}
                {...gameObject}
                gameObjectId={gameObject.gameObjectId}
                gameObjects={gameObjects}
                key={gameObject.id}
                moveObject={this._moveObject}
                sendToBack={this._sendToBack}
                sendToFront={this._sendToFront}
                shouldCloseMenu={this.state.closeAllMenus}
                soundOn={this.props.soundOn}
            />
        )
    })

    const renderCurrentGameObject = this.state.gameObjectInstances.map((gameObject, i) => {
      if (gameObject.beingCreated) {
        return (
            <GameObject
                allowOpen={this._allowOpen}
                closeAllMenus={this._closeAllMenus}
                constrainObject={this._constrainObject}
                deleteObject={this._deleteObject}
                index={i}
                {...gameObject}
                gameObjectId={gameObject.gameObjectId}
                gameObjects={gameObjects}
                key={gameObject.id}
                moveObject={this._moveObject}
                sendToBack={this._sendToBack}
                sendToFront={this._sendToFront}
                shouldCloseMenu={this.state.closeAllMenus}
                soundOn={this.props.soundOn}
            />
        )
      }
    })

    const objectBeingCreated = renderCurrentGameObject ? (
        <View style={styles.creatingPlayArea}>
            {renderCurrentGameObject}
        </View>
    ) : null

    const sendEmailDialog = this.state.sendDialogOpen ? (
        <EmailDialog
            cancelDialog={this._cancelEmailDialog}
            sendEmail={this._sendEmail}
        />)
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
                    resizeMode={Image.resizeMode.contain}
                    source={dividerImage}
                    style={styles.dividerImage}
                />
            </View>

            {objectBeingCreated}

            <TouchableWithoutFeedback onPress={this._closeAllMenus}>
                <View style={styles.playArea}>
                    <View ref={this.setRef}
                        style={styles.playArea}
                    >
                        {renderGameObjectInstances}
                    </View>
                    <View style={styles.navBar}>
                        <NavigationMenu
                            full
                            allowOpen={this._allowOpen}
                            shouldCloseMenu={this.state.closeAllMenus}
                            goToMenu={this._goToMenu}
                            showMailDialog={this._openEmailDialog}
                            soundOn={this.props.soundOn}
                            toggleSound={this.props.toggleSound}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
    backgroundColor: colors.background,
  },
  objectMenu: {
    zIndex: 10,
    width: 150,
    maxWidth: 150,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  creatingPlayArea: {
    position: 'absolute',
    zIndex: 100,
    marginLeft: 165,
  },
  playArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  divider: {
    zIndex: 10,
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
    // height: 150,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    // backgroundColor: 'yellow',
  },
})
