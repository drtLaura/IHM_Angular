import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Post } from '../models/post.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flux',
  standalone: true,
  imports: [
    MatCheckboxModule, FormsModule, MatInputModule, MatFormFieldModule,
    MatButtonModule, MatIconModule, MatExpansionModule, MatCardModule, CommonModule
  ],
  templateUrl: './flux.component.html',
  styleUrls: ['./flux.component.css']
})

export class FluxComponent implements OnInit {
  panelOpenState = false;
  posts: WritableSignal<Post[]>; // initialise les posts
  filteredPosts: WritableSignal<Post[]>; // posts de l'user connecté
  showOnlyMyPosts: boolean = false;
  postContent: string = '';
  message: string = '';
  isLogged: boolean = false;
  editingPostId: number | null = null;
  editedContents: { [key: number]: string } = {};
  editingContent: string = '';

  constructor(private postService: PostService, public authService: AuthService, private router: Router) {
    this.posts = this.postService.getPostsSignal(); // récupération des posts depuis le service
    this.isLogged = this.authService.isAuthenticated();
    this.filteredPosts = signal(this.posts());
  }

  ngOnInit(): void {
    this.filterPosts();
  }

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
      this.filterPosts(); // Mettre à jour la liste des posts filtrés
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
    console.log('voici lid du post qui est en train detre modifié :', post.id);
    this.editingContent = post.content;
  }

  updatePost(post: Post): void {
    if (this.editingPostId === post.id && this.editingContent.trim()) {
      const updatedPost: Post = { ...post, content: this.editingContent };
      this.postService.updatePost(updatedPost);
      this.editingPostId = null;
      this.editingContent = '';
      this.filterPosts();
    }
  }


  cancelEdit(): void {
    this.editingPostId = null;
    this.editingContent = '';
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId);
    this.filterPosts();
  }

  addLike(postId: number): void {
    const result = this.postService.addLike(postId);
    if (result.success) {
      this.filterPosts();
    } else {
      this.message = result.message || 'Erreur inconnue';
    }
  }

  hasLiked(post: Post): boolean { // vérifie si l'utilisateur a déjà liké le post
    const currentUserId = this.authService.getCurrentUserId();
    return post.likedBy.includes(currentUserId);
  }

  viewPost(postId: number): void {
    this.router.navigate(['/post', postId]);
  }

}
