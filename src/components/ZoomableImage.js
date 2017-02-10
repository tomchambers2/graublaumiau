import React, {Component, PropTypes} from 'react';
import { View, PanResponder, Image } from 'react-native';

import ImageSequence from 'react-native-image-sequence';

function calcDistance(x1, y1, x2, y2) {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function calcCenter(x1, y1, x2, y2) {

    function middle(p1, p2) {
        return p1 > p2 ? p1 - (p1 - p2) / 2 : p2 - (p2 - p1) / 2;
    }

    return {
        x: middle(x1, x2),
        y: middle(y1, y2),
    };
}

function maxOffset(offset, windowDimension, imageDimension) {
    let max = windowDimension - imageDimension;
    if (max >= 0) {
        return 0;
    }
    return offset < max ? max : offset;
}

function calcOffsetByZoom(width, height, imageWidth, imageHeight, zoom) {
    let xDiff = imageWidth * zoom - width;
    let yDiff = imageHeight * zoom - height;
    return {
        left: -xDiff/2,
        top: -yDiff/2,
    }
}

class ZoomableImage extends Component {
    static propTypes = {
        imageHeight: PropTypes.number.isRequired,
        imageWidth: PropTypes.number.isRequired,
        sequence: PropTypes.array,
        sequenceDisabled: PropTypes.bool,
        sequencePaused: PropTypes.bool,
        source: PropTypes.node.isRequired,
        style: PropTypes.array.isRequired,
    }

    static defaultProps = {
        sequence: null,
        sequenceDisabled: false,
        sequencePaused: false,
    }

    constructor(props) {
        super(props);

        this._onLayout = this._onLayout.bind(this);

        this.state = {
            zoom: null,
            minZoom: null,
            layoutKnown: false,
            isZooming: false,
            isMoving: false,
            initialDistance: null,
            initialX: null,
            initalY: null,
            offsetTop: 0,
            offsetLeft: 0,
            initialTop: 0,
            initialLeft: 0,
            initialTopWithoutZoom: 0,
            initialLeftWithoutZoom: 0,
            initialZoom: 1,
            top: 0,
            left: 0,
        }

        this.lastMovement = {
            x: 0,
            y: 0,
        }
    }

    componentWillMount() {
      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => {
              this.props.allowOpen()
              this.wasLongPresssed = false
              this.objectPressTimer = setTimeout(() => {
                  this.wasLongPresssed = true
                  this.props.toggleMenu()
              }, 400)

              this.props.turnOnDragging()
          },
          onPanResponderMove: (evt, gestureState) => {
              clearTimeout(this.objectPressTimer)

              let touches = evt.nativeEvent.touches;
              if (touches.length == 1) {
                  this.props.moveObject(this.props.index, gestureState.dx - this.lastMovement.x, gestureState.dy - this.lastMovement.y)
                  this.lastMovement = {
                      x: gestureState.dx,
                      y: gestureState.dy,
                  }
              } else if (touches.length == 2) {
                  this.processPinch(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
              }
          },
          onPanResponderRelease: (evt, gestureState) => {
              clearTimeout(this.objectPressTimer)

              if (!this.wasLongPresssed) {
                  this.props.closeAllMenus()
              }
              this.props.turnOffDragging()

              this.setState({
                  isZooming: false,
                  isMoving: false,
              });

            this.props.constrainObject(this.props.index)
            this.lastMovement = {
              x: 0,
              y: 0,
            }
          },

          onPanResponderTerminationRequest: (evt, gestureState) => {},
          onPanResponderTerminate: (evt, gestureState) => true,
          onShouldBlockNativeResponder: (evt, gestureState) => true,
      });
    }

    processPinch(x1, y1, x2, y2) {
        let distance = calcDistance(x1, y1, x2, y2);
        let center = calcCenter(x1, y1, x2, y2);

        if (!this.state.isZooming) {
            let offsetByZoom = calcOffsetByZoom(this.state.width, this.state.height,
                            this.props.imageWidth, this.props.imageHeight, this.state.zoom);
            this.setState({
                isZooming: true,
                initialDistance: distance,
                initialX: center.x,
                initialY: center.y,
                initialTop: this.state.top,
                initialLeft: this.state.left,
                initialZoom: this.state.zoom,
                initialTopWithoutZoom: this.state.top - offsetByZoom.top,
                initialLeftWithoutZoom: this.state.left - offsetByZoom.left,
            });
        } else {
            let touchZoom = distance / this.state.initialDistance;
            let zoom = touchZoom * this.state.initialZoom > this.state.minZoom
                ? touchZoom * this.state.initialZoom : this.state.minZoom;

            let offsetByZoom = calcOffsetByZoom(this.state.width, this.state.height,
                this.props.imageWidth, this.props.imageHeight, zoom);
            let left = (this.state.initialLeftWithoutZoom * touchZoom) + offsetByZoom.left;
            let top = (this.state.initialTopWithoutZoom * touchZoom) + offsetByZoom.top;

            this.setState({
                zoom: zoom,
                // left: 0,
                // top: 0,
                left: left > 0 ? 0 : maxOffset(left, this.state.width, this.props.imageWidth * zoom),
                top: top > 0 ? 0 : maxOffset(top, this.state.height, this.props.imageHeight * zoom),
            });
        }
    }

    processTouch(x, y) {
        if (!this.state.isMoving) {
            this.setState({
                isMoving: true,
                initialX: x,
                initialY: y,
                initialTop: this.state.top,
                initialLeft: this.state.left,
            });
        } else {
            let left = this.state.initialLeft + x - this.state.initialX;
            let top = this.state.initialTop + y - this.state.initialY;

            this.setState({
                left: left > 0 ? 0 : maxOffset(left, this.state.width, this.props.imageWidth * this.state.zoom),
                top: top > 0 ? 0 : maxOffset(top, this.state.height, this.props.imageHeight * this.state.zoom),
            });
        }
    }

    _onLayout(event) {
        let layout = event.nativeEvent.layout;

        if (layout.width === this.state.width
            && layout.height === this.state.height) {
            return;
        }

        let zoom = layout.width / this.props.imageWidth;

        let offsetTop = layout.height > this.props.imageHeight * zoom ?
            (layout.height - this.props.imageHeight * zoom) / 2
            : 0;

        this.setState({
            layoutKnown: true,
            width: layout.width,
            height: layout.height,
            zoom: zoom,
            offsetTop: offsetTop,
            minZoom: zoom,
        });
    }

    render() {
        const settings = {
          position: 'absolute',
          top: this.state.offsetTop + this.state.top,
          left: this.state.offsetLeft + this.state.left,
          width: this.props.imageWidth * this.state.zoom,
          height: this.props.imageHeight * this.state.zoom,
        }

        const sequenceOpacity = this.props.sequencePaused ? 0 : 1
        const imageOpacity = this.props.sequencePaused ? 1 : 0

        let sequence = (
            <ImageSequence
                images={this.props.sequence}
                resizeMode={Image.resizeMode.contain}
                style={[settings, { opacity: sequenceOpacity }]}
            />
        )

        const image = (
            <Image
                source={this.props.source}
                style={[settings, { opacity: imageOpacity }]}
            />
        )

        sequence = this.props.sequence && !this.props.sequenceDisabled ? sequence : null

        return (
            <View
                style={this.props.style}
                {...this._panResponder.panHandlers}
                onLayout={this._onLayout}
            >
                {image}
                {sequence}
            </View>
        );
    }

}

export default ZoomableImage;
