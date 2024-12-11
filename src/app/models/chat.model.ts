import { User } from "./user.model";

export interface Chat {
    id: number;
    name: string;
    users: User[];
    messages: Message[];
  }
  
  export interface Message {
    id: number;
    user: { id: number; username: string };
    content: string;
    date: Date;
    isEditing: boolean;
  }