import { Injectable, signal, WritableSignal } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: WritableSignal<Post[]> = signal([ // initialise les posts avec writableSignal
    { id: 1,  idUser : 1 , content: 'Vous avez des musiques à me conseiller ?', time: new Date() },
    { id: 2,  idUser : 2 , content: 'Quel banger !', time: new Date() },
  ]);

  constructor() {}

  getPostsSignal(): WritableSignal<Post[]> { // retourne les posts
    return this.posts; // retourne les posts sous WritableSignal<Post[]>
  }


  addPost(post: Post): void { // ajoute un post
    this.posts.set([...this.posts(), post]); // modifie le writableSignal
  }

}
