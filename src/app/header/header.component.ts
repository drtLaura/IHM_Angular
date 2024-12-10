import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterLink, MatButtonModule, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated: Observable<boolean>; // statut d'authentification : vrai ou faux
  currentUser: { id: number, username: string } | null = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuth(); // renvoie un observable de behavior subject le statut d'authentification (vrai ou faux)
  }

  ngOnInit(): void {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.currentUser = this.authService.getCurrentUser();
      } else {
        this.currentUser = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
