import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native'

import MainMenu from './MainMenu'

class Imprint extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired
  }

  _goBack() {
    this.props.navigator.resetTo({ id: 'MainMenu' })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button onPress={this._goBack.bind(this)} title="Back" />
        <Text>Impressum</Text>
      </View>
    )
  }
}

export default Imprint
