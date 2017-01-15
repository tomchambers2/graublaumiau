import React, { Component, PropTypes } from 'react';
import {
  TouchableHighlight,
} from 'react-native'

class NavigationButton extends Component {
  static propTypes = {
    style: PropTypes.number,
    onPress: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  }
  render() {
    return (
      <TouchableHighlight
        style={this.props.style}
        onPress={this.props.onPress}
        underlayColor="rgba(255,255,255,0)"
        activeOpacity={0.7}>
        {this.props.children}
      </TouchableHighlight>
    )
  }
}

export default NavigationButton
