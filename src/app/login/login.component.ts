import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginStatus: 'success' | 'failed' | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    const result = this.authService.login(this.username, this.password); // appele la méthode login de AuthService avec les champs du formulaire
    if (result.success) { // si la connexion est réussie
      this.loginStatus = 'success';
      this.successMessage = 'Connexion réussie ! Vous allez être redirigé...';
      setTimeout(() => {
        this.router.navigate(['/']); // redirige vers le flux après 2 secondes
      }, 2000);
    } else { // si la connexion échoue
      this.loginStatus = 'failed';
      this.errorMessage = result.message || 'Erreur inconnue';
    }
  }

  hide = signal(true); // pour le champ mdp
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
