import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FaceApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FaceApiProvider {

  private FaceApiInfo = {
    subscriptionKey: "62efe0fe0c9c44249365d9c4681b91e8",
    uriBase: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"
  }
  constructor(public http: HttpClient) {
    console.log('Hello FaceApiProvider Provider');
  }

  detectFace(imgData) {

    let Options = {
      headers: {
        //"Content-Type": "application/json",
        "Content-Type":"application/octet-stream",
        "Ocp-Apim-Subscription-Key": this.FaceApiInfo.subscriptionKey
      },
      params: {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
      }
    }

    return new Promise(resolve => {
      this.http.post(this.FaceApiInfo.uriBase, imgData, Options).subscribe(data => {resolve(data[0]); });
    });
  }
}
