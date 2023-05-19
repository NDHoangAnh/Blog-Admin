import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { Post } from '../models/post';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private storage: AngularFireStorage, 
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
    ) { }

  uploadImg(selectedImg: any, postData: any, formStatus: any, id: any){
    const filePath = `postIMG/${Date.now()}`;
    this.storage.upload(filePath, selectedImg).then(() => {
      console.log('OK');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImg = URL;
        console.log(postData);

        if(formStatus == 'Edit'){
          this.updateData(id, postData);
        }else{
          this.saveData(postData);
        }
      })
    })
  }


  saveData(postData: any){
    this.afs.collection('posts').add(postData).then((docRef) => {
      console.log(docRef);
      this.toastr.success('Data insert successfully');
      this.router.navigate(['/posts']);
    })

  }

  loadData(){
    return this.afs.collection('posts').snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data }
        })
      })
    )
  }

  loadOneData(id: any){
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateData(id: any, postData: any){
    this.afs.doc(`posts/${id}`).update(postData).then(() =>{
      this.toastr.success('Data Updated Successfully');
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(postImgPath: any, id: any){
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.deleteData(id);
    })
  }

  deleteData(id: any){
    this.afs.doc(`posts/${id}`).delete().then(() => {
      this.toastr.warning('Deleted');
    })
  }

  markFeatured(id: any, featuredData: any){
    this.afs.doc(`posts/${id}`).update(featuredData).then(() => {
      this.toastr.info('Featured Satus Updated!');
    })
  }
}
