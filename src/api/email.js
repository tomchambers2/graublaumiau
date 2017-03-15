import { Alert } from 'react-native'

import { takeSnapshot } from 'react-native-view-shot'
import { NativeModules } from "react-native";
const { RNMail } = NativeModules;

const body = `Schreibe hier eine Nachricht für Deine Postkarte.<br>
<br>
<hr>
<i>Information<br>
Diese Postkarte wurde mit der App «grau blau miau» erstellt.<br>
<br>
Auf der Seite «www.graublaumiau.ch» werden alle Postkarten gesammelt und hochgeladen.<br>
Die Emailadresse im Feld «Blindkopie» kann auch gelöscht werden, dann erreicht Deine Postkarte nur die Emailadresse im Feld «An».<br>
<br>
www.graublaumiau.ch</i><br>`

const email = {
  send(componentRef, callback) {
    takeSnapshot(componentRef, {
      format: "jpeg",
      quality: 0.8,
    })
    .then(
      uri => {
        RNMail.mail({
          subject: 'Postkarte von «grau blau miau»',
          recipients: ['beispiel@beispiel.ch'],
          bccRecipients: ['postkarte@graublaumiau.ch'],
          body: body,
          isHTML: true,
          attachment: {
            path: uri,  // The absolute path of the file from which to read data.
            type: 'jpg',   // Mime Type: jpg, png, doc, ppt, html, pdf
            name: 'my-drawing.jpg',   // Optional: Custom filename for attachment
          },
        }, (error, event) => {
            if(error === 'not_available') {
              Alert.alert('Stopp!', 'Um Postkarten zu versenden, muss Dein Ipad Mailprogramm eingerichtet sein.');
            } else if (error) {
              Alert.alert('Hoppla!', 'Ein unbekannter Fehler ist aufgetreten. Deine Postkarte kann nur versendet werdet, wenn das Emailprogramm konfiguriert ist.')
            } else {
                // success message
              Alert.alert('Geschafft!', 'Deine Postkarte wurde versendet!')
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
