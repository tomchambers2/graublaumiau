import {Image,PixelRatio} from 'react-native'

// const dog = require('./images/dog.png')

this.pixelDensity = PixelRatio.get();
console.log(this.pixelDensity)

const images = {
    dog: {
        file: { uri: 'dog.png' },
        icon: { uri: 'icon_dog' },
    },
}

const stills = ['dog']//, 'miau1', 'miau2', 'vogel', 'miau3']
const animations = [
    {
        name: 'baum',
        soundName: 'samp.wav',
        sequenceLength: 42,
        playTime: 3,
        pauseTime: 5,
    },
]

const gameObjects = []

let counter = 0

for (let i = 0; i < stills.length; i++) {
    const name = stills[i]

    Image.getSize('dog@2x.png', (width, height) => {
        gameObjects.push({
            gid: counter,
            image: images[name].file,
            icon: images[name].icon,
            size: {width,height},
        })
        counter++
    })
}

setTimeout(() => {
    console.log(gameObjects)
})

// for (let j = 0; j < animations.length; j++) {
//     //generate sequence
//     const sequence = []
//     for (var i = 0; i < animations[i].sequenceLength; i++) {
//         sequence.push(require('./images/' + animations[i].name + '/' + animations[i].name + '-' + i))
//     }
//
//     let size = null
//     Image.getSize(sequence[0], (width, height) => {
//         size = {width,height}
//     })
//
//     const object = Object.assign(animations[i],
//         {
//             gid: counter,
//             isAnimation: true,
//             sequence,
//             icon: sequence[0],
//             size,
//         }
//     )
//
//     gameObjects.push(object)
//
//     counter++
// }

export default gameObjects
