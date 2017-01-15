import React, { Component } from 'react'
import {
  View,
  NavigatorIOS,
  StatusBar,
  StyleSheet,
} from 'react-native'

import MainMenu from './MainMenu'
import Story from './Story'

class GrauBlauMiau extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <StatusBar hidden />
        <NavigatorIOS
          initialRoute={{
            component: Story,
            title: 'Grau Blau Miau',
          }}
          style={styles.wrapper}
          navigationBarHidden={true}>
        </NavigatorIOS>
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
