var fs = require('fs')
var sizeOf = require('image-size');

var gameObjects = []

var gidCounter = 0

var timers = {}
timers.baum_animation = { play: 3.66, pause: 10 }
timers.beine_animation = { play: 1.83, pause: 15 }
timers.feuer_animation = { play: 1.99, pause: 10 }
timers.fleck_gruen_animation = { play: 1.66, pause: 15 }
timers.katze_aufstehen_animation = { play: 2.08, pause: 8 }
timers.katze_still_animation = { play: 1.74, pause: 8 }
timers.milo_walking_animation = { play: 2.99, pause: 10 }
timers.pflanze_animation = { play: 8.99, pause: 15 }
timers.pflanze_bluete_animation = { play: 6.24, pause: 10 }
timers.punkte_animation = { play: 1.66, pause: 0 }
timers.wabber_animation = { play: 4.99, pause: 15 }

var sounds = {
  baum_animation: 'baum.mp3',
  beine_animation: 'beine.mp3',
  feuer_animation: 'feuer.mp3',
  fleck_gruen_animation: 'fleck-gruen.mp3',
  katze_aufstehen_animation: 'katze-aufstehen.mp3',
  katze_still_animation: 'katze-still.mp3',
  milo_walking_animation: 'milo-walking.mp3',
  pflanze_animation_bluete: 'pflanze-bluete.mp3',
  pflanze_animation: 'pflanze.mp3',
  punkte_animation: 'punkte.mp3',
  wabber_animation: 'wabber.mp3',
}

var initialZoom = {
  kugel: 0.6,
  kugel1: 0.6,
  kugel2: 0.6,
  kugel3: 0.6,
  dog: 0.5,
  vogel: 0.6,
  schiff: 0.6,
  loch: 0.6,
  miau3: 0.6,
  stein: 0.8,
  stein1: 0.8,
}


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
            initialZoom: initialZoom[trimmedName],
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
            soundName: sounds[name],
            initialZoom: initialZoom[name],
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
