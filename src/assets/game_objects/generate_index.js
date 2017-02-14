var fs = require('fs')
var sizeOf = require('image-size');

var gameObjects = []

var gidCounter = 0

var timers = {}
timers.baum = { play: 3, minPause: 10, maxPause: 20 }
timers.beine = { play: 3, minPause: 10, maxPause: 20 }
timers.feuer = { play: 3, minPause: 10, maxPause: 20 }
timers.fleck_greune = { play: 3, minPause: 10, maxPause: 20 }
timers.milo_walking = { play: 3, minPause: 10, maxPause: 20 }
timers.pflanze = { play: 3, minPause: 10, maxPause: 20 }
timers.pflanze_bluete = { play: 3, minPause: 10, maxPause: 20 }
timers.wabber = { play: 3, minPause: 10, maxPause: 20 }

timers.punkte = { play: 3, pause: 0 }
timers.katze_still = { play: 3, pause: 7 }
timers.katze_aufstehen = { play: 3, pause: 20 }


fs.readdir('./images', (err, files) => {
    if (err) return console.error(err)

    files.forEach((name) => {
        var re = /^(?!icon)\w+(.png)$/
        if (!re.test(name)) return

        var trimmedName = name.split('.')[0]

        var size = sizeOf('./images/' + name);

        gameObjects.push({
            gid: gidCounter,
            name: trimmedName,
            size,
            image: "require('./images/" + name + "')",
            icon: "require('./images/icon_" + name + "')",
        })
        gidCounter++

        console.log('still complete')
    })
})

fs.readdir('./images', (err, files) => {
    if (err) return console.error(err)

    // loop over all files (including dirs)
    files.forEach((name) => {
        var re = /^\w+$/
        if (!re.test(name)) return

        var animation = {
            gid: gidCounter,
            name: name,
            soundName: '',
            playTime: timers[name] && timers[name].play,
            pauseTime: timers[name] && timers[name].pause,
            minPause: timers[name] && timers[name].minPause,
            maxPause: timers[name] && timers[name].maxPause,
        }
        gidCounter++

        var sequence = []
        fs.readdir('./images/' + name, (err, files) => {
            files.forEach((name) => {
                var re = /^[a-z0-9A-Z-_]+\d+(.png)$/
                if (!re.test(name)) return
                sequence.push(name)
            })

            var sortedSequence = sequence.sort((a, b) => {
                const re = /(\d+)\./
                const aIndex = re.exec(a)[1]
                const bIndex = re.exec(b)[1]
                return aIndex - bIndex
            })

            var size = sizeOf('./images/' + name + '/' + sortedSequence[0]);
            animation.size = size

            var convertedSequence = sequence.map((image) => {
                return "require('./images/" + name + "/" + image + "')"
            })

            animation.icon = "require('./images/icon_" + name + ".png')"

            animation.sequence = convertedSequence
            animation.sequenceLength = convertedSequence.length
            animation.image = convertedSequence[0]


            gameObjects.push(animation)

            console.log('animation complete')
        })
    })
})

setTimeout(() => {
    let output = JSON.stringify(gameObjects, null, 2);
    output = output.replace(/"require/g, 'require')
    output = output.replace(/\)"/g, ')')
    fs.writeFile('output.json', output)
}, 500)
