import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {

  postArray: Array<any> = [];

  constructor(private postService: PostService){}
  ngOnInit(): void {
      this.postService.loadData().subscribe(val => {
        this.postArray = val;
      })
  }

  onDelete(postImgPath: any, id: any){
    this.postService.deleteImage(postImgPath, id);
  }

  onFeatured(id: any, value: boolean){
    const featuredData = {
      isFeatured: value
    }

    this.postService.markFeatured(id, featuredData);
  }
}
