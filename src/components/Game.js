import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'

import colors from '../colors'
import update from 'immutability-helper';
import { Alert } from 'react-native'
import Sound from 'react-native-sound';

import email from '../api/email'
import EmailDialog from './EmailDialog'
import NavigationMenu from './NavigationMenu'
import GameObject from './GameObject'

import gameObjects from '../assets/game_objects/'

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
    this.panResponders = []

    const panResponderStartHandler = () => true
    const panResponderGrantHandler = (gameObjectIndex) => {
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
            gameObjectId: 0,
            x: x - 300,
            y: y - 100,
            width: gameObjects[gameObjectIndex].size.width,
            height: gameObjects[gameObjectIndex].size.height,
            dragging: true,
            data: gameObjects[gameObjectIndex],
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
      this._constrainObject(index)
      this._cancelBeingCreated()
    //   this._stopDragging()
    }

    for (var i = 0; i < gameObjects.length; i++) {
      this.panResponders[i] = PanResponder.create({
        onStartShouldSetPanResponder: panResponderStartHandler,
        onPanResponderGrant: panResponderGrantHandler(i),
        onPanResponderMove: panResponderMoveHandler,
        onPanResponderRelease: panResponderReleaseHandler,
      })
    }
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
    this.setState({
      soundOn: newProps.soundOn,
    })
    if (!newProps.soundOn) {
      this.bg.setVolume(0)
    } else {
      this.bg.setVolume(1)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.closeAllMenus) {
      this.setState({
        closeAllMenus: false,
      })
    }
  }

  _goToMenu = () => {
    this.bg.pause()
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

  // _stopDragging = (index) => {
  //   const data = this.state.gameObjectInstances
  //   const updatedData = update(data[index], { dragging: { $set: false } })
  //   const newData = update(data, {
  //     $splice: [[index, 1, updatedData]],
  //   })
  //   this.setState({
  //     gameObjectInstances: newData,
  //   })
  // }

  _cancelBeingCreated = () => {
    const index = this.state.gameObjectInstances.length - 1
    const data = this.state.gameObjectInstances
    const updatedProperties = {
      beingCreated: { $set: false },
    }
    const updatedData = update(data[index], updatedProperties)
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
      console.log("RENDER GAME")
    const renderGameObjects = gameObjects.map((gameObject, i) => {
      return (
          <View
              key={gameObject.gid}
              style={styles.placeholder}
              {...this.panResponders[i].panHandlers}
          >
              <Image
                  resizeMode={Image.resizeMode.contain}
                  source={gameObject.image}
                  style={{ width: 120 }}
              />
          </View>
      )
    })

    const renderGameObjectInstances = this.state.gameObjectInstances.map((gameObject, i) => {
        if (gameObject.beingCreated) return
        console.log('render creating:false')
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
         console.log('render creating:true')
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
    backgroundColor: colors.objectMenu,
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
