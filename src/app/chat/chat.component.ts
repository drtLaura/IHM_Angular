import { Component, OnInit } from '@angular/core';
import { FriendsComponent } from "../friends/friends.component";
import { MessagesComponent } from "../messages/messages.component";
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CreateChatComponent } from "../create-chat/create-chat.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FriendsComponent, MessagesComponent, CommonModule, MatButtonModule, MatIconModule, MatCardModule, CreateChatComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] // Correction : styleUrls au lieu de styleUrl
})
export class ChatComponent implements OnInit {
  // Contrôle si app-friends est visible ou non
  showFriends: boolean = false;

  // Contrôle si app-messages est visible ou non
  showMessages: boolean = false;

  // Contrôle si app-create-chat est visible ou non
  showForm: boolean = false;

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

  toggleCreateChat():void {
    this.showForm = !this.showForm;
  }

  isCurrentUser(chat: { id: number; name: string; users: { id: number; username: string }[] }): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return chat.users.some(user => user.id === currentUserId);
  }

  addChat(){
    // Selectionne un ou des ami(s) dans la liste d'amis et les ajout au chat
    // Ajouter un nom de chat de type "chat"+numéro du chat
    // Affiche la liste des chats avec le nouveau chat en haut de liste 
  }

}
