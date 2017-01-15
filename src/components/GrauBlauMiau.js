console.disableYellowBox = true;

import React, { Component } from 'react'
import {
  View,
  Navigator,
  StatusBar,
  StyleSheet,
} from 'react-native'

import MainMenu from './MainMenu'
import Story from './Story'
import Game from './Game'
import Imprint from './Imprint'

class GrauBlauMiau extends Component {
  constructor() {
    super()
    this.state = {
      soundOn: true,
    }
  }

  _renderScene = (route, navigator) => {
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
      soundOn: !this.state.soundOn
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
