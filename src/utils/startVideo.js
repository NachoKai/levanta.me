export const startVideo = videoRef => {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then(stream => {
      videoRef.current.srcObject = stream;
    })
    .catch(err => console.error(err));
};
