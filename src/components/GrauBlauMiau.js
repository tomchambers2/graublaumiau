import React, { Component } from 'react'
import {
  View,
  NavigatorIOS,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native'

import MainMenu from './MainMenu'
import Game from './Game'

class GrauBlauMiau extends Component {
  _renderScene(route) {
    return <Text>hi</Text>
    switch (route.name) {
      case 'start':
        return <MainMenu></MainMenu>
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <NavigatorIOS
          initialRoute={{
            component: MainMenu,
            title: 'my scene'
          }}
          style={{flex: 1}}
          navigationBarHidden={true}>
        </NavigatorIOS>
      </View>
    )
  }
}

export default GrauBlauMiau
