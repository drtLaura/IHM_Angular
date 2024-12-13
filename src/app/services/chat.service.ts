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

  private currentChat: any = null;

  constructor() { 
    this.currentChat=[];
  }

  getAllChats(){
    return this.Chats;
  }

  getChatById(chatId: number) {
    return this.Chats.find(chat => chat.id === chatId);
  }

  setCurrentChat(chat: any):void{
    this.currentChat=chat;
  }

  getCurrentMessages():any{
    return this.currentChat.messages;
  }

  getCurrentChatId():number{
    return this.currentChat.id;
  }


  addMessageToChat(chatId: number, message: {   id: number, user: { id: number, username: string },  content: string, date: Date,  isEditing : boolean }) {
    const chat = this.getChatById(chatId);
    if (chat) {
      const user = chat.users.find(u => u.id === message.user.id);
      if (user) {
        chat.messages.push({
          id: chat.messages.length + 1,  // Génère un nouvel ID
          user: { id: message.user.id, username: message.user.username },
          content: message.content,
          date: message.date,
          isEdited: message.isEditing,
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

  addChat(newChat: { name: string; usersID: number[], usersUsername: string[]}) {
    const chatId = this.Chats.length + 1;  // Générer un ID pour la discussion (peut être amélioré)
    
    // Créer un tableau d'utilisateurs avec les objets contenant l'id et le nom d'utilisateur
    const users = newChat.usersID.map((userId, index) => {
      return { id: userId, username: newChat.usersUsername[index] };
    });
    
    // Créer l'objet de chat avec les utilisateurs et un tableau vide de messages
    const chat = {
      id: chatId,
      name: newChat.name,
      users: users,  // Utilisateurs avec id et username
      messages: []  // Initialiser la discussion sans message
    };
    
    // Ajouter le chat à la liste des chats
    this.Chats.push(chat);
    
    // Log pour vérifier le chat créé (à retirer dans un environnement de production)
    console.log('Chat créé :', chat);
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

  // Mettre à jour un message dans un chat
  updateMessageInChat(chatId: number, messageId: number, newContent: string) {
    const chat = this.getChatById(chatId);
    if (chat) {
      const message = chat.messages.find(m => m.id === messageId);
      if (message) {
        message.content = newContent;
        message.isEdited = true;  // Marque comme modifié
      }
    }
  }

  // Supprimer un message dans un chat
  deleteMessageInChat(chatId: number, messageId: number) {
    const chat = this.getChatById(chatId);
    if (chat) {
      chat.messages = chat.messages.filter(m => m.id !== messageId);
    }
  }


}
