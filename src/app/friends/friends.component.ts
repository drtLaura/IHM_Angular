import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-friends',
  standalone: true, // indique que ce composant est autonome
  imports: [FormsModule], // on importe uniquement FormsModule ici, pas BrowserModule
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  users: { id: number; username: string }[] = [];
  friends: { id: number; username: string }[] = [];
  filteredUsernames: { id: number; username: string }[] = [];
  searchTerm: string = ''; // Contient la valeur de la barre de recherche

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.users = this.authService['Users']; // Récupère tous les utilisateurs
    this.authService.getFriends().subscribe((friends) => {
      this.friends = friends;
      this.updateFilteredUsernames(); // Mettre à jour les résultats filtrés à l'initialisation
    });
  }

  // Méthode de filtrage basée sur le texte de recherche
  filterResults(text: string): void {
    this.searchTerm = text; // Met à jour le terme de recherche
    this.updateFilteredUsernames(); // Met à jour la liste filtrée après chaque recherche
  }

  // Met à jour la liste des utilisateurs filtrés en fonction de la recherche
  private updateFilteredUsernames(): void {
    this.filteredUsernames = this.users.filter((user) =>
      !this.friends.some((friend) => friend.id === user.id) &&
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      this.authService.getCurrentUser()?.id !== user.id // Exclure l'utilisateur actuel
    );
  }

  addFriend(userId: number): void {
    if (this.authService.addFriend(userId)) {
      alert('Ami ajouté !');
      this.updateFilteredUsernames(); // Met à jour la liste des résultats filtrés après ajout
    } else {
      alert('Cet utilisateur est déjà un ami.');
    }
  }

  removeFriend(userId: number): void {
    if (this.authService.removeFriend(userId)) {
      alert('Ami supprimé.');
      this.updateFilteredUsernames(); // Met à jour la liste des résultats filtrés après suppression
    }
  }
}
