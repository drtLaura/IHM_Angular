import { Component, OnInit, WritableSignal } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Post } from '../models/post.model';
@Component({
  selector: 'app-flux',
  standalone: true,
  imports: [ MatCardModule, CommonModule ],
  templateUrl: './flux.component.html',
  styleUrl: './flux.component.css'
})
export class FluxComponent {

  posts: WritableSignal<Post[]>; // initialise les posts

  constructor(private postService: PostService, private authService: AuthService) {
    this.posts = this.postService.getPostsSignal(); // récupération des posts depuis le service
  }

  ngOnInit(): void {}

  getUserNameById(id: number): string | undefined {
    return this.authService.getUserNameById(id);
  }
  getUserProfilePictureById(id: number): string | undefined {
    return this.authService.getUserProfilePictureById(id);
  }
}
