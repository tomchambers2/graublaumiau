var fs = require('fs')
var sizeOf = require('image-size');

var gameObjects = []

var gidCounter = 0

var timers = {}
timers.baum_animation = { play: 3.5, pause: 10 }
timers.beine_animation = { play: 3, pause: 15 }
timers.feuer_animation = { play: 2.08, pause: 10 }
timers.fleck_greun_animation = { play: 3.36, pause: 15 }
timers.katze_aufstehen_animation = { play: 2.04, pause: 8 }
timers.katze_still_animation = { play: 2.4, pause: 8 }
timers.milo_walking_animation = { play: 3, pause: 10 }
timers.pflanze_animation = { play: 8.64, pause: 15 }
timers.pflanze_bluete_animation = { play: 6.12, pause: 10 }
timers.punkte_animation = { play: 1.64, pause: 0 }
timers.wabber_animation = { play: 9.72, pause: 15 }


fs.readdir('./images', (err, files) => {
    if (err) return console.error(err)

    files.forEach((name) => {
        var re = /^(?!icon)\w+(.png)$/
        if (!re.test(name)) return

        var trimmedName = name.split('.')[0]

        var size = sizeOf('./images/' + name);

        fs.access('./images/icon_' + name, (err) => {
          if (err) {
            console.log(err)
            process.exit()
          }
        })

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
            playTime: timers[name] && timers[name].play * 1000,
            pauseTime: timers[name] && timers[name].pause * 1000,
            minPause: timers[name] && timers[name].minPause * 1000,
            maxPause: timers[name] && timers[name].maxPause * 1000,
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

            fs.access('./images/icon_' + name + '.png', (err) => {
              if (err) {
                console.log(err)
                process.exit()
              }
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
