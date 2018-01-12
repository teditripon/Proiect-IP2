import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FaceApiProvider } from '../../providers/face-api/face-api';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, private camera: Camera, private faceApiService: FaceApiProvider) {
  };

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    targetWidth: 1000,
    targetHeight: 1000,
    saveToPhotoAlbum: true
  }

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    
     // var mImg = { url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg" };
      var blobimg = fetch(base64Image ) .then(res => res.blob());
        console.log(blobimg);
      this.faceApiService.detectFace(blobimg).then(res => { console.log(res) });
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }
}




