export interface Comment {
  id: number;
  content: string;
  idUser: number;
  time: Date;
  likedBy: number[];
}

export interface Post {
  id: number;
  idUser: number;
  content: string;
  time: Date;
  nblike: number;
  likedBy: number[];
  comments: Comment[];
}
