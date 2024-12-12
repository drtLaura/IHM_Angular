import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../models/post.model';

@Pipe({ name: 'filterByUser' })
export class FilterByUserPipe implements PipeTransform {
  transform(posts: Post[], showOnlyMyPosts: boolean, currentUserId: number): Post[] {
    if (!showOnlyMyPosts) return posts;
    return posts.filter((post) => post.idUser === currentUserId);
  }
}
