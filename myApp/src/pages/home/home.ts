import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FaceApiProvider } from '../../providers/face-api/face-api';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
 
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
    saveToPhotoAlbum: false
  }
  public lastsnap: Object;
  public resdata: Object;

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.lastsnap = base64Image;
      var blobimg = this.convertBase64PictureToBlob(base64Image);
      this.faceApiService.detectFace(blobimg).then(res => {
        console.log(res);
        this.resdata = res;
      }
      );
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

  convertBase64PictureToBlob(base64Img) {
    var BASE64_MARKER = ';base64,';
    if (base64Img.indexOf(BASE64_MARKER) == -1) {
      var parts = base64Img.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    var parts = base64Img.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
}


    //   var makeblob = function (dataURL) {
    //     var BASE64_MARKER = ';base64,';
    //     if (dataURL.indexOf(BASE64_MARKER) == -1) {
    //         var parts = dataURL.split(',');
    //         var contentType = parts[0].split(':')[1];
    //         var raw = decodeURIComponent(parts[1]);
    //         return new Blob([raw], { type: contentType });
    //     }
    //     var parts = dataURL.split(BASE64_MARKER);
    //     var contentType = parts[0].split(':')[1];
    //     var raw = window.atob(parts[1]);
    //     var rawLength = raw.length;

    //     var uInt8Array = new Uint8Array(rawLength);

    //     for (var i = 0; i < rawLength; ++i) {
    //         uInt8Array[i] = raw.charCodeAt(i);
    //     }

    //     return new Blob([uInt8Array], { type: contentType });
    // }


