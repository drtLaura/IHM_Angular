import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private Chats = [
    {
      id: 1,
      users: [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' }
      ],
      name: 'test',
      messages: [
        { id: 1, user : {id:2, username:'user2'} , content:'Salut!', date: new Date(2024, 11, 10, 10, 30), isEdited:false}
      ] 
    }
  ];

  constructor() { }

  getAllChats(){
    return this.Chats;
  }

  getChatById(chatId: number) {
    return this.Chats.find(chat => chat.id === chatId);
  }

  addMessageToChat(chatId: number, message: { userId: number; content: string; date: Date }) {
    const chat = this.getChatById(chatId);
    if (chat) {
      const user = chat.users.find((u) => u.id === message.userId);
      if (user) {
        chat.messages.push({
          id: chat.messages.length + 1, // Génère un nouvel ID
          user,
          content: message.content,
          date: message.date,
          isEdited: false,
        });
      }
    }
  }

  addUsersToChat(users: { id: number; username: string }[], chatId: number) {
    const chat = this.getChatById(chatId);
    if (chat) {
      users.forEach((newUser) => {
        if (!chat.users.some((u) => u.id === newUser.id)) {
          chat.users.push(newUser); // Ajoute uniquement les utilisateurs qui ne sont pas déjà présents
        }
      });
    }
  }

  addChat(users: { id: number; username: string }[]) {
    const newChat = {
      id: this.Chats.length + 1, // Génère un nouvel ID
      users: users,
      name: `Chat ${this.Chats.length + 1}`, // Nom générique
      messages: [],
    };
    this.Chats.push(newChat);
  }

  // Modifier le nom d'un chat
  editChat(chatId: number, name: string) {
    const chat = this.getChatById(chatId);
    if (chat) {
      chat.name = name;
    }
  }

  // Supprimer un chat
  deleteChat(chatId: number) {
    this.Chats = this.Chats.filter((chat) => chat.id !== chatId);
  }


}
