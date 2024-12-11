import { Component } from '@angular/core';
import { FriendsComponent } from "../friends/friends.component";
import { MessagesComponent } from "../messages/messages.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FriendsComponent, MessagesComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  showFriends: boolean;  // Contrôle si app-friends est visible ou non

  constructor() {
    this.showFriends = false;
  }

  toggleFriends(): void {
    this.showFriends = !this.showFriends;  // Inverse la visibilité de app-friends
  }
}
