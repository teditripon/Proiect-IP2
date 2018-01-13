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
    this.photos = [];
    this.verySadMessages = [
      "You really don't smile a lot do you?",
      "Did someone piss in your coffee this morning?",
      "Your life is terribly boring, you should go have some fun",
      "You are an extremely sad person. Smile; life has great things that we often don't notice",
      "You're totally depressing. Go have some fun dude!",
      "You're so sad you ruined my day, and I'm just a computer..."
    ];

    this.sadMessages = [
      "You seem a little sad. Come here for a hug <3",
      "You might feel a bit sad, but remember, there's someone who loves you, here and in heavens!",
      "Don't be sad, everyone has bad days from time to time!",
      "You look like you forgot to do your homework...",
      "Yo dude, cheer up, it's free!",
      "Why so sad? The skies are blue"
    ];

    this.neutralMessages = [
      "You look like a very balanced person.",
      "Man, you should smile.. Well at least you aren't sad.",
      "Stone cold... No emotions?",
      "Are you from Switzerland? Since your face is so neutral",
      "Can't read anything on your face... You should play poker, you're a natural talent!"
    ];

    this.happyMessages = [
      "Well, you seem like a pleased person.",
      "Finally, people remember how to smile!",
      "They say when you are happy, you make other people happy too.",
      "Smiling is healthy!",
      "You seem to be having a wonderful day."
    ];

    this.veryHappyMessages = [
      "Did you just win the lottery or what?",
      "You look like you've met your true love today.",
      "You might be one of the happiest people in the world.",
      "This looks like your best day.",
      "You are so happy today, don't forget you still need to work tho..."
    ];
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
  public lastsnap: any;
  public resdata: any;
  public test: any;

  public emotions: Array<String>;
  public accesories: Array<String>;
  public smile: Boolean;
  public photoDictionary: any;

  public photos: Array<any>;
  public verySadMessages: Array<string>;
  public sadMessages: Array<string>;
  public neutralMessages: Array<string>;
  public happyMessages: Array<string>;
  public veryHappyMessages: Array<string>;

  public moodMessage: String;
  public averageMoodScore: any;

  

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.lastsnap = base64Image;
      
      var blobimg = this.convertBase64PictureToBlob(base64Image);
      this.test = this.convertBase64PictureToBlob(base64Image);
      this.faceApiService.detectFace(blobimg).then(res => {
        //console.log(res);
        this.resdata = res;
        
        var faceAttribs = this.resdata.faceAttributes;

        this.photoDictionary = {};
        this.photoDictionary.image = this.lastsnap;
        this.photoDictionary.happiness = faceAttribs.emotion.happiness;

        this.photos.push(this.photoDictionary);
        this.photos.sort((a:any,b:any) => {
          return b.happiness - a.happiness;
        });

        var median = this.calculateMedian();
        this.averageMoodScore = median;
        this.moodMessage = this.getMessageByMedian(median);
        
      }
      );
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

  getMessageByMedian(median:any) {
    if (median < 0.2) {
      var random = Math.floor(Math.random() * this.verySadMessages.length);
      return this.verySadMessages[random];
    }
    else if (median >= 0.2 && median < 0.4) {
      var random = Math.floor(Math.random() * this.sadMessages.length);
      return this.sadMessages[random];
    }
    else if (median >= 0.4 && median < 0.6) {
      var random = Math.floor(Math.random() * this.neutralMessages.length);
      return this.neutralMessages[random];
    }
    else if (median >= 0.6 && median < 0.8) {
      var random = Math.floor(Math.random() * this.happyMessages.length);
      return this.happyMessages[random];
    }
    else if (median >= 0.8) {
      var random = Math.floor(Math.random() * this.veryHappyMessages.length);
      return this.veryHappyMessages[random];
    }
  }

  calculateMedian() {
    var total = 0;
    this.photos.forEach(element => {
      total += element.happiness;
    });

    var finalResult = total/this.photos.length;
    return finalResult.toFixed(2);
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


