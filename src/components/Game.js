import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native'

const window = Dimensions.get('window')

import update from 'immutability-helper';

import { takeSnapshot } from 'react-native-view-shot'
import { NativeModules } from "react-native";
const { RNMail } = NativeModules;

import NavigationMenu from './NavigationMenu'
import GameObject from './GameObject'

import colors from '../colors'

import gameObjects from '../data/gameObjects'

import dividerImage from '../assets/game/game_line.png'

class Game extends Component {
  static propTypes = {
    toggleSound: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
    soundOn: React.PropTypes.bool.isRequired,
  }

  constructor() {
    super();

    const pans = []
    gameObjects.forEach(() => {
      pans.push(new Animated.ValueXY())
    })

    this.state = {
      pans,
      scrollEnabled: true,
      gameObjectInstances: [],
    }

    this.panResponders = []

    gameObjects.forEach((gameObject, i) => {
      this.panResponders[i] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, {
          dx: this.state.pans[i].x,
          dy: this.state.pans[i].y,
        }]),
        onPanResponderGrant: () => {
          this.setState({
            scrollEnabled: false,
          })
          return true
        },
        onPanResponderRelease: () => {
          this.setState({
            scrollEnabled: true,
          })
        },
      })
    });
  }

  _goToMenu() {
    // bg.pause()
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  _showMailDialog() {
    // TODO: move to an api
    takeSnapshot(this._playArea, {
      format: "jpeg",
      quality: 0.8,
    })
    .then(
      uri => {
        console.log(uri)
        RNMail.mail({
          subject: 'Ein Bild für Sie',
          recipients: [],
          ccRecipients: ['post@alicekolb.ch'],
          body: '',
          attachment: {
            path: '',  // The absolute path of the file from which to read data.
            type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
            name: '',   // Optional: Custom filename for attachment
          }
        }, (error, event) => {
            if(error === 'not_available') {
              Alert.alert('Error', 'Your mail client is not setup, you must do this to send email');
              console.error(error)
            } else if (error) {
              Alert.alert('Error', 'Unknown error occurred while attempting to send email')
            } else {
              Alert.alert('Mail sent', 'Your picture has been sent!')
            }
        })
      },
      error => console.error("Oops, snapshot failed", error),
    );
  }

  _constrainToGrid(x, y, shapeDimensions) {
    if (x < 0) x = 0
    if (x + (shapeDimensions.width + 180) > window.width) x = window.width - shapeDimensions.width - 180
    if (y < 0) y = 0
    if (y + shapeDimensions.height > window.height) y = window.height - shapeDimensions.height
    return [x, y]
  }

  _moveObject = (x, y) => {
    const data = this.state.gameObjectInstances
    const newY = data[0].y + y
    let newX = data[0].x + x
    // newX -= 180
    let constrainedX, constrainedY
    [constrainedX, constrainedY] = this._constrainToGrid(newX, newY, { width: 300, height: 300 })
    const updatedData = update(data[0], { x: { $set: constrainedX }, y: { $set: constrainedY } })
    const newData = update(data, {
      $splice: [[0, 1, updatedData]],
    })
    this.setState({
      gameObjectInstances: newData,
    })
  }

  componentWillMount() {
    this.setState({
      gameObjectInstances: this.state.gameObjectInstances.concat({ id: 0, x: 0, y: 0 })
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
        <View style={[styles.gameObjectIcon, styles.draggableContainer]}>
          <Animated.View
            {...this.panResponders[i].panHandlers}
            style={[this.state.pans[i].getLayout(), styles.placeholder]}>
            <Text style={styles.text}>Placeholder</Text>
          </Animated.View>
        </View>
      )
    })

    const renderGameObjectInstances = this.state.gameObjectInstances.map((gameObject) => {
        return (<GameObject
          {...gameObject}
          moveObject={this._moveObject}
          />)
    })

    return (
      <View style={styles.gameContainer}>
        <View style={styles.objectMenu}>
          <ScrollView scrollEnabled={this.state.scrollEnabled}>
            {renderGameObjects}
          </ScrollView>
        </View>
        <View style={styles.divider}>
          <Image
            style={styles.wrapper}
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
              showMailDialog={this._showMailDialog.bind(this)}
              goToMenu={this._goToMenu.bind(this)} />
          </View>
        </View>
      </View>
    )
  }

  renderVideos() {
    const videos = []
    for (var i = 0; i < 0; i++) {
      // const video =           (<Video
      //               style={styles.testSquare}
      //               source={TestVideo}
      //               repeat={true}></Video>)

      const video = (<Image
      style={styles.testSquare}
      source={Gif}></Image>)

      videos.push(video);
    }
    return videos
  }

}

export default Game

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  navBar: {
    marginTop: 20,
    marginLeft: 17,
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  objectMenu: {
    width: 150,
    maxWidth: 150,
    backgroundColor: colors.objectMenu,
    flex: 1,
    alignItems: 'center',
  },
  playArea: {
    backgroundColor: colors.playArea,
  },
  gameObjectIcon: {
    marginTop: 15,
    marginBottom: 15,
  },
  divider: {
    flex: 1,
    maxWidth: 26,
    marginLeft: -13,
  },
  placeholder: {
      backgroundColor: colors.placeholder,
      width: 120,
      height: 150,
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
})
