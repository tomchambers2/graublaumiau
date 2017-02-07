import miloWalking from '../png_test/Milo_walking_00000.png'
import miloWalking_animation from './milo_walking_animation.gif'

const gameObjects = [
  {
    gid: 0,
    image: miloWalking,
    size: {
      width: 201,
      height: 300,
    },
    isAnimation: true,
    soundName: 'samp2.wav',
    sequence: [
      require('../png_test/Milo_walking_00000.png'),
      require('../png_test/Milo_walking_00001.png'),
      require('../png_test/Milo_walking_00002.png'),
      require('../png_test/Milo_walking_00003.png'),
      require('../png_test/Milo_walking_00004.png'),
      require('../png_test/Milo_walking_00005.png'),
      require('../png_test/Milo_walking_00006.png'),
      require('../png_test/Milo_walking_00007.png'),
      require('../png_test/Milo_walking_00008.png'),
      require('../png_test/Milo_walking_00009.png'),
      require('../png_test/Milo_walking_00010.png'),
      require('../png_test/Milo_walking_00011.png'),
      require('../png_test/Milo_walking_00012.png'),
      require('../png_test/Milo_walking_00013.png'),
      require('../png_test/Milo_walking_00014.png'),
      require('../png_test/Milo_walking_00015.png'),
      require('../png_test/Milo_walking_00016.png'),
      require('../png_test/Milo_walking_00017.png'),
      require('../png_test/Milo_walking_00018.png'),
      require('../png_test/Milo_walking_00019.png'),
      require('../png_test/Milo_walking_00020.png'),
      require('../png_test/Milo_walking_00021.png'),
      require('../png_test/Milo_walking_00022.png'),
      require('../png_test/Milo_walking_00023.png'),
    ],
    // animation: miloWalking_animation,
  },
  // {
  //   gid: 1,
  //   image: miloWalking,
  // },
  // {
  //   gid: 2,
  //   image: miloWalking,
  // },
  // {
  //   gid: 3,
  //   image: miloWalking,
  // },
  // {
  //   gid: 4,
  //   image: miloWalking,
  // },
  // {
  //   gid: 5,
  //   image: miloWalking,
  // },
]

export default gameObjects
