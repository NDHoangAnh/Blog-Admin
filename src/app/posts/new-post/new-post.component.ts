import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  selectedImg: any = '';
  imgSrc: any = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';

  categories: Array<any> = [];
  postForm: any
  post: any
  formStatus: string = 'Add New';
  docId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
    ){
      this.route.queryParams.subscribe(val =>{
        this.docId = val.id;
        if (this.docId){
          this.postService.loadOneData(val.id).subscribe(post => {

            this.post = post;
            this.postForm = new FormGroup({
              title: new FormControl({value:this.post.title, disabled: false }, Validators.required),
              permalink: new FormControl({value:this.post.permalink, disabled: true }, Validators.required),
              excerpt: new FormControl({value:this.post.excerpt, disabled: false }, Validators.required),
              category: new FormControl({value:`${this.post.category.categoryId}-${this.post.category.category}`, disabled: false }, Validators.required),
              postImg: new FormControl({value:'', disabled: false }, Validators.required),
              content: new FormControl({value:this.post.content, disabled: false }, Validators.required)
            })
  
            this.imgSrc = this.post.postImg;
            this.formStatus = 'Edit';
          })
        }else{
          this.postForm = new FormGroup({
            title: new FormControl({value:'', disabled: false }, Validators.required),
            permalink: new FormControl({value:'', disabled: true }, Validators.required),
            excerpt: new FormControl({value:'', disabled: false }, Validators.required),
            category: new FormControl({value:'', disabled: false }, Validators.required),
            postImg: new FormControl({value:'', disabled: false }, Validators.required),
            content: new FormControl({value:'', disabled: false }, Validators.required)
          })
        }
      })

    }

  ngOnInit(): void{
    this.categoryService.loadData().subscribe(val => {
      this.categories = val;
    })
  }

  get fc(){
    return this.postForm.controls;
  }

  showPreview(event: any){
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result
    }

    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }

  onTitleChanged(event: any){
    const title = event.target.value;
    this.permalink = title.replace(/\s/g,'-');
  }

  onSubmit(){

    let splitted = this.postForm.value.category.split('-');

    console.log(splitted);
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.permalink,
      category: {
          categoryId: splitted[0],
          category: splitted[1]
      },
      postImg: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }

    this.postService.uploadImg(this.selectedImg, postData, this.formStatus,this.docId );

    this.postForm.reset();
    this.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';
  }
}
