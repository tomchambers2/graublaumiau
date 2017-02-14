import React, { Component, PropTypes } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Animated,
    Easing,
    TouchableHighlight,
    Text,
    Dimensions,
} from 'react-native'

const window = Dimensions.get('window')

import page0 from '../story/0'
import page1 from '../story/1'
import page2 from '../story/2'
import page3 from '../story/3'
import page4 from '../story/4'
import page5 from '../story/5'
import page6 from '../story/6'
import page7 from '../story/7'
import page8 from '../story/8'
import page9 from '../story/9'
import page10 from '../story/10'
import page11 from '../story/11'
import page12 from '../story/12'
import page13 from '../story/13'
import page14 from '../story/14'
import page15 from '../story/15'
import page16 from '../story/16'

const pages = {
    0: page0,
    1: page1,
    2: page2,
    3: page3,
    4: page4,
    5: page5,
    6: page6,
    7: page7,
    8: page8,
    9: page9,
    10: page10,
    11: page11,
    12: page12,
    13: page13,
    14: page14,
    15: page15,
    16: page16,
}

const startingNarration = new Sound('narration-0.mp3', Sound.MAIN_BUNDLE)
const soundFilenames = ['main-background-sound.mp3', 'story-background-sound-2.mp3']

const titleSound = new Sound('narration-title.mp3', Sound.MAIN_BUNDLE)

const sounds = {}
sounds[soundFilenames[0]] = new Sound(soundFilenames[0], Sound.MAIN_BUNDLE)
sounds[soundFilenames[1]] = new Sound(soundFilenames[1], Sound.MAIN_BUNDLE)

const TEXT_FADE_TIME = 1000
const BACKGROUND_SOUND_CHANGE_PAGE = 8

import NavigationMenu from './NavigationMenu'
import NavigationButton from './NavigationButton'

import Video from 'react-native-video'

import Sound from 'react-native-sound';

import playIcon from '../assets/story/reader_play.png'
import pauseIcon from '../assets/story/reader_pause.png'
import NavigateLeft from '../assets/story/arrow_left.png'
import NavigateRight from '../assets/story/arrow_right.png'
import endButton from '../assets/story/finish.png'

class Story extends Component {
    static propTypes = {
        navigator: PropTypes.object.isRequired,
        soundOn: PropTypes.bool.isRequired,
        toggleSound: PropTypes.func.isRequired,
        pauseBackgroundSound: PropTypes.func.isRequired,
    }

    constructor() {
        super()

        this.state = {
            narrationPlaying: false,
            _textFade: new Animated.Value(0),
            page: 0,
            totalPages: 17,
            currentBackgroundSound: soundFilenames[0],
        }

        this.playingSounds = {}
    }

    componentDidMount() {
        this.props.pauseBackgroundSound()

        this.backgroundSound = sounds[soundFilenames[0]]
        this.narration = startingNarration

        this._playTitle()
        this._startSound()
        this._fadeInText()
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.soundOn) {
            this.backgroundSound.setVolume(0)
            this.narration.setVolume(0)
            this._pauseNarration()
        } else {
            this.backgroundSound.setVolume(1)
            this.narration.setVolume(1)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this._pauseNarration()
            this.narration = new Sound(`narration-${this.state.page}.mp3`, Sound.MAIN_BUNDLE)
        }
    }

    componentWillUnmount() {
        this.backgroundSound.pause()
        this._pauseNarration({ reset: true })
    }

    _pauseNarration(options={}) {
        this.setState({
            narrationPlaying: false,
        })
        this.narration.pause()
        if (options.reset) {
            this.narration.setCurrentTime(0)
        }
    }

    _playTitle() {
        titleSound.play()
    }

    _playNarration() {
        if (!this.props.soundOn) this.props.toggleSound()
        this.setState({ narrationPlaying: true })

        this.narration.play((result) => {
            if (result) this._pauseNarration()
        })
    }

    _toggleNarration = () => {
        if (this.state.narrationPlaying) {
            this._pauseNarration()
        } else {
            this._playNarration()
        }
    }

    _toggleSound = () => {
        this.props.toggleSound()
    }

    _goToMenu = () => {
        this.backgroundSound.pause()
        this.props.navigator.resetTo({ id: 'MainMenu' })
    }

    _navigateLeft = () => {
        if (this.state.page === 0) {
            this._goToMenu()
        } else {
            this.setState({
                page: this.state.page - 1,
            })
            this._updateBackgroundSound(this.state.page - 1)
            this._fadeInText()
        }
    }

    _navigateRight = () => {
        if ((this.state.page + 1) < this.state.totalPages) {
            this.setState({
                page: this.state.page + 1,
            })
            const newPage = this.state.page + 1
            this._updateBackgroundSound(newPage)
            this._fadeInText()
        } else {
            this._goToMenu()
        }
    }

    _updateBackgroundSound(page) {
        if (page >= BACKGROUND_SOUND_CHANGE_PAGE) {
            if (soundFilenames[1] !== this.state.currentBackgroundSound) {
                this.backgroundSound.pause()
                this.backgroundSound = sounds[soundFilenames[1]]
                this.backgroundSound.play()
                this.setState({
                    currentBackgroundSound: soundFilenames[1],
                })
            }
        } else {
            if (soundFilenames[0] !== this.state.currentBackgroundSound) {
                this.backgroundSound.pause()
                this.backgroundSound = sounds[soundFilenames[0]]
                this.backgroundSound.play()
                this.setState({
                    currentBackgroundSound: soundFilenames[0],
                })
            }
        }
    }

    _fadeInText() {
        this.state._textFade.setValue(0)
        Animated.timing(this.state._textFade, {
            toValue: 1,
            duration: TEXT_FADE_TIME,
            easing: Easing.linear,
        }).start()
    }

    _startSound() {
        if (!this.props.soundOn) {
            this.backgroundSound.setVolume(0)
            this.narration.setVolume(0)
        }
        this.backgroundSound.setNumberOfLoops(-1);
        this.backgroundSound.play()
    }

    _playSoundClip = (soundName) => {
        return () => {
            if (this.playingSounds[soundName]) return
            const sound = new Sound(soundName, Sound.MAIN_BUNDLE, (error) => {
                this.playingSounds[soundName] = true
                sound.play(() => {
                    console.log('done')
                    this.playingSounds[soundName] = false
                })
            })
        }
    }

    renderClickMaps() {
        if (!pages[this.state.page].clickMap) return
        return pages[this.state.page].clickMap.map((area) => {
            const top = (area.top / 100) * window.height
            const left = (area.left / 100) * window.width

            const width = (area.width / 100) * window.width
            const height = (area.height / 100) * window.height
            return (
                <TouchableHighlight
                    key={area.key}
                    underlayColor="rgba(255,255,255,0)"
                    onPress={this._playSoundClip(area.soundName)}
                    style={[styles.clickArea, { width, height, top, left }]}
                >
                    <View></View>
                    {/* <Text>{area.soundName}</Text> */}
                </TouchableHighlight>
            )
            })
        }
        render() {
            const atEnd = (this.state.page + 1) === this.state.totalPages
            const navigateRight = atEnd ? endButton : NavigateRight
            const narrationButtonIcon = this.state.narrationPlaying ? pauseIcon : playIcon

            const video = pages[this.state.page] && pages[this.state.page].video ? (
                <Video
                    repeat
                    source={pages[this.state.page].video}
                    style={styles.backgroundVideo}
                />
            ) : null

            return (
                <View style={styles.mainWrapper}>
                    {this.renderClickMaps()}

                    {video}

                    <Animated.Image
                        resizeMode={Image.resizeMode.cover}
                        source={{ uri: `text${this.state.page}`, isStatic: true }}
                        style={[styles.textBox, { opacity: this.state._textFade }]}
                    />

                    <View style={styles.interactionContainer}>

                        <View style={styles.menuAndContent}>
                            <View style={styles.topMenu}>
                                <NavigationMenu
                                    goToMenu={this._goToMenu}
                                    soundOn={this.props.soundOn}
                                    style={styles.menu}
                                    toggleSound={this._toggleSound}
                                />
                                <NavigationButton
                                    onPress={this._toggleNarration}
                                    style={styles.playButton}
                                >
                                    <Image
                                        resizeMode={Image.resizeMode.contain}
                                        source={narrationButtonIcon}
                                        style={styles.playToggleImage}
                                    />
                                </NavigationButton>
                            </View>
                        </View>

                        <View style={styles.spacer} />

                        <View style={styles.navigationBar}>

                            <NavigationButton
                                onPress={this._navigateLeft}
                            >
                                <Image
                                    resizeMode={Image.resizeMode.contain}
                                    source={NavigateLeft}
                                    style={styles.navigateLeftImage}
                                />
                            </NavigationButton>
                            <NavigationButton
                                onPress={this._navigateRight}
                            >
                                <Image
                                    resizeMode={Image.resizeMode.contain}
                                    source={navigateRight}
                                    style={[styles.navigateRightImage, atEnd && styles.endButton]}
                                />
                            </NavigationButton>
                        </View>
                    </View>
                </View>
            )
        }
    }

const ipadPro = window.width >= 2732
const sideMargin = ipadPro ? 30 : 15
const topMargin = ipadPro ? 20 : 10

const styles = StyleSheet.create({
    endButton: {
        width: 94,
        height: 51,
    },
    clickArea: {
        position: 'absolute',
        zIndex: 100,
        // opacity: 0.5,
        // backgroundColor: 'yellow',
    },
    spacer: {
        flex: 1,
    },
    mainWrapper: {
        flex: 1,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    interactionContainer: {
        flex: 1,
    },
    menuAndContent: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    topMenu: {
        paddingLeft: sideMargin,
        paddingTop: topMargin,
        paddingRight: 30,
        position: 'relative',
        zIndex: 10,
    },
    textBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,

        width: window.width,
        height: window.height,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: sideMargin,
        paddingRight: sideMargin,
        paddingBottom: 20,
    },
    navigateLeftImage: {
        width: 49,
        height: 49,
    },
    navigateRightImage: {
        width: 49,
        height: 49,
    },
    playToggleImage: {
        width: 49,
        height: 49,
    },
    playButton: {
        marginTop: 18,
    },
})

export default Story
