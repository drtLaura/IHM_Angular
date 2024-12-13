import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion'; // Importation du module MatExpansionModule
import { FormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Post, Comment } from '../models/post.model';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [
    RouterLink, MatButtonModule, MatIconModule, CommonModule, MatCardModule,
    MatInputModule, MatFormFieldModule, FormsModule, MatExpansionModule // Ajout de MatExpansionModule aux imports
  ],
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
})
export class PostCommentComponent implements OnInit {
  post: Post | undefined; // initialise le post
  postId: number | null = null; // initialise l'id du post
  commentContent: string = '';
  message: string = '';
  editingCommentId: number | null = null; // Propriété pour suivre l'identifiant du commentaire en cours d'édition
  editingContent: string = ''; // Propriété pour stocker le contenu édité du commentaire

  constructor(public route: ActivatedRoute, public postService: PostService, public authService: AuthService) {}

  ngOnInit(): void { // initialise le post
    this.route.paramMap.subscribe(params => { // route avec paramètres
      this.postId = Number(params.get('id')); // récupère l'id du post
      this.loadPost(); // charge le post
    });
  }

  loadPost(): void { // charge le post
    if (this.postId !== null) { // si l'id du post est défini
      const posts = this.postService.getPostsSignal()(); // récupère les posts
      this.post = posts.find(post => post.id === this.postId); // trouve le post avec l'id correspondant
    }
  }
  addComment(): void {
    if (this.postId !== null && this.commentContent.trim()) {
      const result = this.postService.addComment(this.postId, this.commentContent);
      this.message = result.message || '';
      if (result.success) {
        this.commentContent = '';
        this.loadPost(); // recharger le post pour afficher le nouveau commentaire
      }
    } else {
      this.message = 'Le commentaire ne peut pas être vide';
    }
  }
  editComment(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editingContent = comment.content;
  }

  updateComment(): void {
    if (this.postId !== null && this.editingCommentId !== null && this.editingContent.trim()) {
      const result = this.postService.updateComment(this.postId, this.editingCommentId, this.editingContent);
      this.message = result.message || '';
      if (result.success) {
        this.editingCommentId = null;
        this.editingContent = '';
        this.loadPost(); // recharger le post pour afficher le commentaire mis à jour
      }
    } else {
      this.message = 'Le commentaire ne peut pas être vide';
    }
  }
  cancelEdit(): void {
    this.editingCommentId = null;
    this.editingContent = '';
  }

  deleteComment(commentId: number): void {
    if (this.postId !== null) {
      const result = this.postService.deleteComment(this.postId, commentId);
      this.message = result.message || '';
      if (result.success) {
        this.loadPost(); // recharger le post pour afficher les commentaires mis à jour
      }
    }
  }
  addLikeToComment(commentId: number): void {
    if (this.postId !== null) {
      const result = this.postService.addLikeToComment(this.postId, commentId);
      this.message = result.message || '';
      if (result.success) {
        this.loadPost(); // recharger le post pour afficher les commentaires mis à jour
      }
    }
  }

  hasLikedComment(comment: Comment): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return comment.likedBy.includes(currentUserId);
  }
}
