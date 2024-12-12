import { Component, OnInit } from '@angular/core';
import { FriendsComponent } from "../friends/friends.component";
import { MessagesComponent } from "../messages/messages.component";
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FriendsComponent, MessagesComponent,CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] // Correction : styleUrls au lieu de styleUrl
})
export class ChatComponent implements OnInit {
  // Contrôle si app-friends est visible ou non
  showFriends: boolean = false;

  // Contrôle si app-messages est visible ou non
  showMessages: boolean = false;

  // Liste des chats avec la structure définie
  chats: { 
    id: number; 
    users: { id: number; username: string; }[]; 
    name: string; 
    messages: { 
      id: number; 
      user: { id: number; username: string; }; 
      content: string; 
      date: Date; 
      isEdited: boolean; 
    }[]; 
  }[] = []; // Initialisation à une liste vide

  currentChat: any = null;

  constructor(private chatService: ChatService, private authService: AuthService) {
  } 

  ngOnInit(): void {
    // Chargement des données des chats depuis le service
    this.chats = this.chatService.getAllChats(); // Ajout des parenthèses pour appeler la méthode
  }

  // Inverse la visibilité de app-friends
  toggleFriends(): void {
    this.showFriends = !this.showFriends;
  }

  // Inverse la visibilité de app-messages
  toggleMessages(chat?: any): void {
    if (chat) {
      this.currentChat = chat; // Met à jour le chat sélectionné
      this.chatService.setCurrentChat(chat);
    }
    this.showMessages = !this.showMessages;
  }

  isCurrentUser(chat: { id: number; name: string; users: { id: number; username: string }[] }): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return chat.users.some(user => user.id === currentUserId);
  }

}
