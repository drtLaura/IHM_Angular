import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-chat',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './create-chat.component.html',
  styleUrl: './create-chat.component.css'
})
export class CreateChatComponent implements OnInit {
  name: string = '';
  selectedUsers: number[] = [];
  friends: { id: number; username: string }[] = [];

  constructor(private authService : AuthService, private chatService: ChatService){}

  ngOnInit(): void {
    this.authService.getFriends().subscribe((friends) => {
      this.friends = friends;
    });
  }

  createChat(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('Utilisateur actuel non trouvé.');
      return;
    }
    // Exemple de données pour créer un chat
    const newChat = {
      name: this.name,  // Nom de la discussion
      usersID: [currentUser.id, ...this.selectedUsers], // Inclure l'ID de l'utilisateur actuel
      usersUsername: [
        currentUser.username, 
        ...this.selectedUsers.map(id => this.getUserUsernameById(id))
      ] // Inclure le nom d'utilisateur de l'utilisateur actuel
    };
  
    // Appeler le service pour ajouter le chat
    this.chatService.addChat(newChat);
  }
  
  // Méthode pour récupérer le nom d'utilisateur en fonction de l'ID
  getUserUsernameById(id: number): string {
    const user = this.friends.find(friend => friend.id === id);
    return user ? user.username : '';
  }
  

}
