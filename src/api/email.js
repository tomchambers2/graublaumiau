import { Alert } from 'react-native'

import { takeSnapshot } from 'react-native-view-shot'
import { NativeModules } from "react-native";
const { RNMail } = NativeModules;

const body = `Hallo!
Ich habe dieses Bild mit der App "grau blau miau" erstellt.

Auf Milos Blog werden alle Bilder hochgeladen www.graublaumiau.ch. Du kannst die Emailadresse im Feld "CC" aber auch löschen, dann wird das Bild nur an deine Emailadresse versendet.

Grüsse
von`

const email = {
  send(componentRef, callback) {
    takeSnapshot(componentRef, {
      format: "jpeg",
      quality: 0.8,
    })
    .then(
      uri => {
        RNMail.mail({
          subject: 'Ein Bild für Sie',
          recipients: [],
          ccRecipients: ['post@alicekolb.ch'],
          body: body,
          attachment: {
            path: uri,  // The absolute path of the file from which to read data.
            type: 'jpg',   // Mime Type: jpg, png, doc, ppt, html, pdf
            name: 'my-drawing.jpg',   // Optional: Custom filename for attachment
          },
        }, (error, event) => {
            if(error === 'not_available') {
              Alert.alert('Error', 'Your mail client is not setup, you must do this to send email');
            } else if (error) {
              Alert.alert('Error', 'Unknown error occurred while attempting to send email')
            } else {
              Alert.alert('Mail sent', 'Your picture has been sent!')
            }
            callback()
        })
      }, (error) => {
        Alert.alert('Error', 'Unknown error occurred while attempting to send email')
        callback()
      }
    )
  },
}

export default email
