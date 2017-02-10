console.disableYellowBox = true // eslint-disable-line no-console

import React, { Component } from 'react'
import {
  View,
  Navigator,
  StatusBar,
  StyleSheet,
} from 'react-native'

import SplashScreen from './SplashScreen'
import MainMenu from './MainMenu'
import Story from './Story'
import Game from './Game'
import Imprint from './Imprint'

const override = 'Game'

class GrauBlauMiau extends Component {
  constructor() {
    super()
    this.state = {
      soundOn: true,
      splashScreenDisplayed: override || false,
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
          hideSplashScreen={this._hideSplashScreen}
              />)
    }

    const props = {
      navigator,
      soundOn: this.state.soundOn,
      toggleSound: this._toggleSound,
    }
    if (route.id === 'MainMenu') return <MainMenu {...props} />
    if (route.id === 'Story') return <Story {...props} />
    if (route.id === 'Game') return <Game {...props} />
    if (route.id === 'Imprint') return <Imprint {...props} />
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
                    id: override || 'MainMenu',
          }}
                renderScene={this._renderScene}
                style={styles.wrapper}
            />
        </View>
    )
  }
}

export default GrauBlauMiau

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
})
