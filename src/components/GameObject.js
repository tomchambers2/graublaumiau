import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    StyleSheet,
    Animated,
} from 'react-native'

import ZoomableImage from './ZoomableImage'
import NavigationButton from './NavigationButton'

import menuBackground from '../assets/game/menu_background.png'
import upIcon from '../assets/game/up.png'
import deleteIcon from '../assets/game/delete.png'
import downIcon from '../assets/game/down.png'

import Sound from 'react-native-sound';

const ANIMATION_DELAY_AFTER_DROP = 1000

class Game extends Component {
    static propTypes = {
        allowOpen: PropTypes.func.isRequired,
        closeAllMenus: PropTypes.func.isRequired,
        constrainObject: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        deleteObject: PropTypes.func.isRequired,
        sendToFront: PropTypes.func.isRequired,
        sendToBack: PropTypes.func.isRequired,
        gameObjects: PropTypes.array.isRequired,
        index: PropTypes.number.isRequired,
        moveObject: PropTypes.func.isRequired,
        soundOn: PropTypes.bool.isRequired,
        gameObjectId: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }

    static defaultProps = {
        allowOpen: true,
    }

    constructor() {
        super()

        this.lastMovement = {
            x: 0,
            y: 0,
        }

        this.dragging = true

        this.lastShouldCloseMenu = false

        this.state = {
            menuOpen: false,
            width: null,
            height: null,
            disabled: true,
        }
    }

    componentWillMount() {

        this.gameObject = this.props.gameObjects.find((gameObject) => gameObject.gid === this.props.gameObjectId)
        this.gameObjectImage = this.gameObject.image

        this.setState({
            top: new Animated.Value(this.props.y),
            left: new Animated.Value(this.props.x),
            width: this.gameObject.size.width,
            height: this.gameObject.size.height,
        })

        if (!this.props.beingCreated) {
            this.dragging = false

            if (this.gameObject.sequence && this.gameObject.sequence.length) {
                this.init = true
                this.animationTimer = setTimeout(() => {
                    this._playAnimation()
                }, this.gameObject.playTime || ANIMATION_DELAY_AFTER_DROP)
            }
        }

        if (this.props.data.soundName) {
          this.sound = new Sound(this.props.data.soundName, Sound.MAIN_BUNDLE, (err) => {
          })
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.shouldCloseMenu) {
            this.setState({
                menuOpen: false,
            })
            this.lastShouldCloseMenu = true
        }

        if (this.dragging) {
            this.state.top.setValue(newProps.y)
            this.state.left.setValue(newProps.x)
        } else {
            Animated.timing(
                this.state.top,
                { toValue: newProps.y, duration: 350 }
            ).start()
            Animated.timing(
                this.state.left,
                { toValue: newProps.x, duration: 350 }
            ).start()
        }
    }

    componentWillUnmount() {
      if (this.sound) {
        this.sound.pause()
      }
      clearTimeout(this.animationTimer)
    }

    _turnOnDragging = () => {
        this.dragging = true
    }

    _turnOffDragging = () => {
        this.dragging = false
    }

    _deleteSelf = () => {
        this.props.deleteObject(this.props.index)
    }

    _toggleMenu = () => {
        if (this.state.menuOpen) {
            this.props.closeAllMenus()
        }
        this.setState({
            menuOpen: !this.state.menuOpen,
        })
    }

    _sendToFront = () => {
        this.props.sendToFront(this.props.index)
        this._toggleMenu()
    }

    _sendToBack = () => {
        this.props.sendToBack(this.props.index)
        this._toggleMenu()
    }

    _playAnimation = () => {
        this.setState({
            disabled: false,
        })

        if (this.props.soundOn && this.sound) {
            this.sound.play()
        }

        this.animationTimer = setTimeout(() => {
            this.setState({
                disabled: true,
            })

            let pauseTime
            if (!this.gameObject.pauseTime) {
                const min = this.gameObject.minPause
                const max = this.gameObject.maxPause
                pauseTime = Math.round(Math.random() * (max-min)+min)
            } else {
                pauseTime = this.gameObject.pauseTime
            }

            this.animationTimer = setTimeout(() => {
                this._playAnimation()
            }, pauseTime)
        }, this.gameObject.playTime)
    }

    render() {
        const menu = this.state.menuOpen ? (
            <TouchableHighlight
                onPress={this._toggleMenu}
                underlayColor='transparent'
                style={[styles.menuContainer, { width: this.state.width, height: this.state.height }]}
            >
            <View>
                <Image source={menuBackground}
                    style={styles.menuInner}
                >
                    <NavigationButton
                        onPress={this._sendToFront}
                        style={styles.icon}
                    >
                    <Image source={upIcon} />
                    </NavigationButton>
                    <NavigationButton
                        onPress={this._deleteSelf}
                        style={styles.delete}
                    >
                        <Image source={deleteIcon} />
                    </NavigationButton>
                    <NavigationButton
                        onPress={this._sendToBack}
                        style={styles.icon}
                    >
                        <Image source={downIcon} />
                    </NavigationButton>
                    </Image>
                    </View>
                </TouchableHighlight>
                ) : null

                return (
                    <Animated.View
                        style={[ styles.gameObject, { top: this.state.top, left: this.state.left, width: this.state.width, height: this.state.height } ]}
                    >
                            {menu}
                            <ZoomableImage
                                imageHeight={this.gameObject.size.height}
                                imageWidth={this.gameObject.size.width}
                                allowOpen={this.props.allowOpen}
                                toggleMenu={this._toggleMenu}
                                closeAllMenus={this.props.closeAllMenus}
                                turnOnDragging={this._turnOnDragging}
                                turnOffDragging={this._turnOffDragging}
                                constrainObject={this.props.constrainObject}
                                index={this.props.index}
                                moveObject={this.props.moveObject}
                                sequence={this.gameObject.sequence}
                                sequenceDisabled={!this.init}
                                sequencePaused={this.state.disabled}
                                source={this.gameObject.image}
                                style={[styles.inner, { width: this.state.width, height: this.state.height }]}
                            />
                        </Animated.View>
                    )
                }
            }

    const styles = StyleSheet.create({
        icon: {
            marginTop: 18,
            marginLeft: 12,
        },
        menuContainer: {
            position: 'absolute',
            zIndex: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        delete: {
            marginTop: 18,
            marginLeft: 14,
        },
        gameObject: {
            position: 'absolute',
        },
    })

    export default Game
