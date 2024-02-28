import { Dialog, DialogContent, DialogTitle } from 'react-native-paper'
import React, { useContext, useState } from 'react'
import fileDownload from "js-file-download";
import axios from "axios";

function ImageZoomPopup(props) {
  const {title,openImageZoomPopup, setOpenImageZoomPopup, image } = props

  const handleClose = () => {
    setOpenImageZoomPopup(false);
  };

  const downloadImage = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob",
        headers: {
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Header' : '*'
        },
        withCredentials: false
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  return (
    <Dialog open={openImageZoomPopup} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <div>{title}</div>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <button onClick={() => downloadImage(image, "image.jpg")}>Download!</button>
          <div>
            {image && <img src={image} alt="Selected Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
          </div>
        </div>
        {console.log(image)}
      </DialogContent>
    </Dialog>
  )
}

export default ImageZoomPopup