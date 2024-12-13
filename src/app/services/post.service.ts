import { Injectable, signal, WritableSignal } from '@angular/core';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';
import { Comment } from '../models/post.model';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: WritableSignal<Post[]> = signal([
    { id: 1, idUser: 1, content: 'Vous avez des musiques à me conseiller ?', time: new Date(), nblike: 4, likedBy: [], comments: [{ id: 1, content: 'je te conseille la nouvelle musique de Dua lipa ;)', idUser: 2, time: new Date(), likedBy: [2] }] },
    { id: 2, idUser: 2, content: 'Qui écoute du rap ?', time: new Date(), nblike: 3, likedBy: [], comments: [{ id: 1, content: 'moi ^^', idUser: 1, time: new Date(), likedBy: [1] }] }
  ]);
  private nextId: number = 3;
  private nextCommentId: number = 2;

  constructor(private authService: AuthService) {}

  getPostsSignal(): WritableSignal<Post[]> { // retourne les posts
    return this.posts; // retourne les posts sous WritableSignal<Post[]>
  }

  addPost(postContent: string):  { success: boolean, message?: string }  { // ajoute un post
    if (!postContent ) { // si les champs ne sont pas remplis
      return { success: false, message: 'Veuillez remplir tous les champs' };
    }
    if (!this.authService.isAuthenticated()) { // vérification de l'authentification
      return { success: false, message: 'Connectez vous pour pouvoir poster!' };
    }
    // on crée un nouveau post
    const newPost = {
      id: this.nextId++,
      idUser: this.authService.getCurrentUserId(),
      content: postContent, // contenu du post
      time: new Date(),
      nblike: 0,
      likedBy: [],
      comments: []
    };

    this.posts.set([...this.posts(), newPost]); // ajoute le nouveau post
    return { success: true }; // retourne un objet avec un succès
  }

  updatePost(updatedPost: Post): void {
    const posts = this.posts().map(post => post.id === updatedPost.id ? updatedPost : post);
    this.posts.set(posts);
  }

  deletePost(postId: number): void {
    const posts = this.posts().filter(post => post.id !== postId);
    this.posts.set(posts);
  }
  addLike(postId: number): { success: boolean, message?: string } {
    const currentUserId = this.authService.getCurrentUserId();
    if (!this.authService.isAuthenticated()) {
      return { success: false, message: 'Vous devez être connecté pour liker un post      ng generate component post-comment' };
    }

    const posts = this.posts().map(post => {
      if (post.id === postId) {
        if (post.idUser === currentUserId) {
          return { ...post, nblike: post.nblike };
        }
        if (post.likedBy.includes(currentUserId)) {
          return { ...post, nblike: post.nblike };
        }
        return { ...post, nblike: post.nblike + 1, likedBy: [...post.likedBy, currentUserId] };
      }
      return post;
    });
    this.posts.set(posts);
    return { success: true };
  }

  addComment(postId: number, commentContent: string): { success: boolean, message?: string } {
    if (!commentContent) {
      return { success: false, message: 'Le commentaire ne peut pas être vide.' };
    }
    if (!this.authService.isAuthenticated()) {
      return { success: false, message: 'Vous devez être connecté pour commenter.' };
    }

    const currentUserId = this.authService.getCurrentUserId();
    const newComment: Comment = {
      id: this.nextCommentId++,
      content: commentContent,
      idUser: currentUserId,
      time: new Date(),
      likedBy: []
    };

    const posts = this.posts().map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    this.posts.set(posts);
    return { success: true, message: 'Commentaire ajouté avec succès.' };
  }

  updateComment(postId: number, commentId: number, updatedContent: string): { success: boolean, message?: string } {
    const posts = this.posts().map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content: updatedContent };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    this.posts.set(posts);
    return { success: true, message: 'Commentaire mis à jour avec succès.' };
  }

  deleteComment(postId: number, commentId: number): { success: boolean, message?: string } {
    const posts = this.posts().map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter(comment => comment.id !== commentId);
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    this.posts.set(posts);
    return { success: true, message: 'Commentaire supprimé avec succès.' };
  }

  addLikeToComment(postId: number, commentId: number): { success: boolean, message?: string } {
    const currentUserId = this.authService.getCurrentUserId();
    if (!this.authService.isAuthenticated()) {
      return { success: false};
    }

    const posts = this.posts().map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            if (comment.idUser === currentUserId || comment.likedBy.includes(currentUserId)) {
              return comment;
            }
            return { ...comment, likedBy: [...comment.likedBy, currentUserId] };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    this.posts.set(posts);
    return { success: true };
  }

  getUserNameById(id: number): string | undefined {
    return this.authService.getUserNameById(id);
  }

  getUserProfilePictureById(id: number): string | undefined {
    return this.authService.getUserProfilePictureById(id);
  }

}
