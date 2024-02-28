import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent } from 'react-native-paper';
import { View, Image, Button } from 'react-native';
import { SendPhotoContext } from '../SendPhotoContext';

function Popup(props) {
  const { title, openPopup, setOpenPopup, image } = props;
  const { sendPhoto, setSendPhoto } = useContext(SendPhotoContext);

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Dialog visible={openPopup} onDismiss={handleClose}>
      <DialogTitle>
        <View>
          <Text>{title}</Text>
        </View>
      </DialogTitle>
      <DialogContent>
        <View>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
      </DialogContent>

      <Button
        title="Send"
        onPress={() => {
          setSendPhoto(true);
          setOpenPopup(false);
        }}
      />
    </Dialog>
  );
}

export default Popup;