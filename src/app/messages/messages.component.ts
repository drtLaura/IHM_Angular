import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule,DatePipe,CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  text : string = "";
  messages: { id: number; user: { id: number; username: string }; content: string; date: Date ; isEditing: boolean }[] = [];  // Liste des messages
  currentUserId !: number;

  constructor(private authService: AuthService, private chatService: ChatService) {

  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.messages = this.chatService.getCurrentMessages();
  }

  // Fonction pour envoyer un message
  sendMessage(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = this.authService.getCurrentUserId();
    if (this.text.trim() && currentUser) {
      const newMessage = {
        id: this.messages.length + 1,  // L'ID est généré en fonction de la taille du tableau
        user: { id: currentUser.id, username: currentUser.username },  // Utilisateur sans BehaviorSubject
        content: this.text,
        date: new Date(),  // Enregistrer la date du message
        isEditing : false
      };
      this.messages.push(newMessage); // Ajouter le message à la liste
      //this.chatService.addMessageToChat(this.chatService.getCurrentChatId(),newMessage);
      console.log('Message envoyé:', this.text);
      this.text = '';  // Réinitialiser le message après l'envoi
    } else {
      console.log('Le message est vide');
    }
  }

  // Fonction pour mettre à jour un message
  updateMessage(messageId: number, newMessage: string) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.content = newMessage;
    }
  }

  // Fonction pour supprimer un message
  deleteMessage(messageId: number) {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }

}
