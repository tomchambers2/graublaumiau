import React, { PropTypes } from 'react';
import {
  TouchableHighlight,
} from 'react-native'

const NavigationButton = ({ style, onPress, children }) => {
    return (
        <TouchableHighlight
            activeOpacity={0.7}
            onPress={onPress}
            style={style}
            underlayColor="rgba(255,255,255,0)"
        >
            {children}
        </TouchableHighlight>
    )
}

NavigationButton.propTypes = {
    children: PropTypes.element.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.any,
}
NavigationButton.defaultProps = {
    style: {},
}

export default NavigationButton
