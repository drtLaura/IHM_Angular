import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Post } from '../models/post.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-flux',
  standalone: true,
  imports: [MatCheckbox, FormsModule, MatInputModule, MatFormFieldModule,MatButtonModule, MatIconModule,  MatExpansionModule, MatCardModule, CommonModule ],
  templateUrl: './flux.component.html',
  styleUrl: './flux.component.css'
})

export class FluxComponent {
  panelOpenState = false;
  posts: WritableSignal<Post[]>; // initialise les posts
  filteredPosts: WritableSignal<Post[]>; // posts de l'user connecté
  showOnlyMyPosts: boolean = false;
  postContent: string = '';
  message: string = '';
  isLogged: boolean = false;

  editingPostId: number | null = null;
  editedContent: string = '';

  constructor(private postService: PostService, public authService: AuthService) {
    this.posts = this.postService.getPostsSignal(); // récupération des posts depuis le service
    this.isLogged = this.authService.isAuthenticated();
    this.filteredPosts = signal(this.posts());
  }

  ngOnInit(): void {}

  getUserNameById(id: number): string | undefined {
    return this.authService.getUserNameById(id);
  }
  getUserProfilePictureById(id: number): string | undefined {
    return this.authService.getUserProfilePictureById(id);
  }

  addPost(): void {
    const result = this.postService.addPost(this.postContent); // appele la méthode register de AuthService avec les champs du formulaire
    if (result.success) { // si l'ajout est réussie
      this.postContent = '';
      this.message = 'Votre avis a été ajouté !';
    } else { // si l'inscription échoue
      this.message = result.message || 'Erreur inconnue';
    }
  }

  filterPosts(): void {
    if (this.showOnlyMyPosts) {
      const currentUserId = this.authService.getCurrentUserId();
      this.filteredPosts.set(this.posts().filter(post => post.idUser === currentUserId));
    } else {
      this.filteredPosts.set(this.posts());
    }
  }

  editPost(post: Post): void {
    this.editingPostId = post.id;
    this.editedContent = post.content;
  }

  updatePost(post: Post): void {
    if (this.editedContent.trim()) {
      post.content = this.editedContent;
      this.postService.updatePost(post);
      this.editingPostId = null;
      this.editedContent = '';
    }
  }

  cancelEdit(): void {
    this.editingPostId = null;
    this.editedContent = '';
  }
  deletePost(postId: number): void {
    this.postService.deletePost(postId);
  }

}
