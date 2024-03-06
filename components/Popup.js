import React, { useContext } from 'react';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import { View, Image, Platform, PlatformColor, StyleSheet } from 'react-native';
import { SendPhotoContext } from '../SendPhotoContext';


function Popup(props) {
  const { title, openPopup, setOpenPopup, image } = props
  const { sendPhoto, setSendPhoto } = useContext(SendPhotoContext);

  const handleClose = () => {
    setOpenPopup(false);
  };


  return (
    <PaperProvider>
    
        <Portal>
          <Dialog visible={openPopup} onDismiss={handleClose} style={{ width: 300, height: 200 }}>
            <Dialog.Title>
              Hi
            </Dialog.Title>
            <Dialog.Content>
              <Text >This is simple dialog</Text>
            </Dialog.Content>
            {/* <DialogContent>
        <View>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
      </DialogContent>  */}

            {/* <Dialog.Button
        title="Send"
        onPress={() => {
          setSendPhoto(true);
          setOpenPopup(false);
        }}
      />  */}
          </Dialog>
        </Portal>
 
    </PaperProvider>
  );
}

export default Popup;