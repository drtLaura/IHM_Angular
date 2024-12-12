export interface Post {
  id: number;
  idUser: number;
  content: string;
  time: Date;
  nblike: number;
  likedBy: number[];
}
