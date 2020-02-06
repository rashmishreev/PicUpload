import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  photo: SafeResourceUrl;
  successMsg: string = '';
  //filepath: any;
  downloadedImage : string;
  timestamp = Number(new Date());
  date = new Date(this.timestamp);


  constructor(private sanitizer: DomSanitizer,private datab: AngularFirestore,
              private storage: AngularFireStorage,  private http: HttpClient) { }

  ngOnInit() {
    this.successMsg = '';
  }

  async takePicture() {
    console.log('***TAKING PIC***');
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.path));
    console.log('***IMAGE base64String***');
    console.log(image.base64String);
    var filepath = Math.random().toString(36).substring(2);
    
    
    const ref = this.storage.ref(filepath);
    const task = ref.putString(image.base64String).then((snapshot) => {
      console.log('***UPLOAD SUCCESSFUL, IN putString THEN***');
      this.successMsg = 'Upload successful. View pic in Last pic uploaded page';
      console.log('***EXITING UPLOAD***');
      console.dir(snapshot);
      this.storage.ref(filepath).getDownloadURL().subscribe(url => {
        this.datab.collection('test').add({
          imageURL: url,
          timestamp: this.date
        });
        this.http.get(url,  {responseType: 'text'}).subscribe((result) => {
        console.log('******GOT IMG RESULT******');
        console.dir(result);
        this.downloadedImage = 'data:image/jpeg;base64,' + result;
      })
    });
    }).catch((err) => {
      console.log('***ERR***');
      console.dir(err);

    });
    }
  }
