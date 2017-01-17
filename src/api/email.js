import { Alert } from 'react-native'

import { takeSnapshot } from 'react-native-view-shot'
import { NativeModules } from "react-native";
const { RNMail } = NativeModules;

const email = {
  send(componentRef) {
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
          body: '',
          attachment: {
            path: uri,  // The absolute path of the file from which to read data.
            type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
            name: '',   // Optional: Custom filename for attachment
          },
        }, (error, event) => {
            if(error === 'not_available') {
              Alert.alert('Error', 'Your mail client is not setup, you must do this to send email');
            } else if (error) {
              Alert.alert('Error', 'Unknown error occurred while attempting to send email')
            } else {
              Alert.alert('Mail sent', 'Your picture has been sent!')
            }
        })
      },
      error => Alert.alert('Error', 'Unknown error occurred while attempting to send email')
    )
  },
}

export default email
