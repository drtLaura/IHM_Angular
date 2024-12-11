import { Injectable, signal, WritableSignal } from '@angular/core';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: WritableSignal<Post[]> = signal([ // initialise les posts avec writableSignal
    { id: 1,  idUser : 1 , content: 'Vous avez des musiques à me conseiller ?', time: new Date() },
    { id: 2,  idUser : 2 , content: 'Quel banger !', time: new Date() },
  ]);

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
    // on crée un nouvel utilisateur
    const newPost = {
      id: this.posts.length + 1,
      idUser: this.authService.getCurrentUserId(),
      content: postContent,
      time: new Date()
    };

    this.posts.set([...this.posts(), newPost]); // ajoute le nouveau post dans
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
}
