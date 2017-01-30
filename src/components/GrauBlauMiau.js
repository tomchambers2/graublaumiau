console.disableYellowBox = true;

import React, { Component } from 'react'
import {
  View,
  Navigator,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native'

import SplashScreen from './SplashScreen'
import MainMenu from './MainMenu'
import Story from './Story'
import Game from './Game'
import Imprint from './Imprint'

class GrauBlauMiau extends Component {
  constructor() {
    super()
    this.state = {
      soundOn: true,
      splashScreenDisplayed: false,
    }
  }

  _hideSplashScreen = () => {
    this.setState({
      splashScreenDisplayed: true,
    })
  }

  _renderScene = (route, navigator) => {
    if (!this.state.splashScreenDisplayed) {
      return (<SplashScreen
        hideSplashScreen={this._hideSplashScreen}></SplashScreen>)
    }

    const props = {
      navigator,
      soundOn: this.state.soundOn,
      toggleSound: this._toggleSound,
    }
    if (route.id === 'MainMenu') return <MainMenu {...props}></MainMenu>
    if (route.id === 'Story') return <Story {...props}></Story>
    if (route.id === 'Game') return <Game {...props}></Game>
    if (route.id === 'Imprint') return <Imprint {...props}></Imprint>
  }

  _toggleSound = () => {
    this.setState({
      soundOn: !this.state.soundOn,
    })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <StatusBar hidden />
        <Navigator
          initialRoute={{
            id: 'MainMenu',
          }}
          renderScene={this._renderScene}
          style={styles.wrapper}>
        </Navigator>
        {/* <Text style={styles.text}>hello world</Text> */}
      </View>
    )
  }
}

export default GrauBlauMiau

const styles = StyleSheet.create({
  text: {
    fontSize: 100,
  },
  wrapper: {
    flex: 1,
  },
})
