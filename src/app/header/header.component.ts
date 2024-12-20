import { Component, Signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isAuthenticated: Signal<boolean>; // initialise l'état de connexion
  currentUser: Signal<{ id: number; username: string, pp : string} | null>; // initialise l'utilisateur actuel

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated;
    this.currentUser = this.authService.currentUser;
  }

  logout(): void { // méthode pour se déconnecter, appele la méthode logout de AuthService
    this.authService.logout();
    alert ('Vous êtes déconnecté');
  }
}
