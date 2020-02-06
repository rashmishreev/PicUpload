import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  downloadedImage : string;
  imageUrl: any;
  timestamp = Number(new Date());
  date = new Date(this.timestamp);

  constructor(private storage: AngularFireStorage,
              private http: HttpClient, private datab: AngularFirestore,) { }

  

  ngOnInit() {
    var filepath = Math.random().toString(36).substring(2);
    const ref = this.storage.ref(filepath).getDownloadURL().subscribe(url => {
      console.log('******IN VIEW LAST PIC******');
      console.log('******CHECKING DOWNLOAD URL******');
      this.datab.collection('test').add({
        imageURL: url,
        timestamp:  this.date });
      console.log(url + "UPDATED");
      this.http.get(url,  {responseType: 'text'}).subscribe((result) => {
        console.log('******GOT IMG RESULT******');
        console.dir(result);
        this.downloadedImage = 'data:image/jpeg;base64,' + result;
      });
    });
    
  

  }
  
}
