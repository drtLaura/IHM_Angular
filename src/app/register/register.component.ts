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
  selector: 'app-register',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password1: string = '';
  password2: string = '';
  registerStatus: 'success' | 'failed' | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    const result = this.authService.register(this.username, this.password1, this.password2); // appele la méthode register de AuthService avec les champs du formulaire
    if (result.success) { // si l'inscription est réussie
      this.registerStatus = 'success';
      this.successMessage = 'Inscription réussie ! Vous allez être redirigé...';
      setTimeout(() => {
        this.router.navigate(['/']); // redirige vers le flux après 2 secondes
      }, 3000);
    } else { // si l'inscription échoue
      this.registerStatus = 'failed';
      this.errorMessage = result.message || 'Erreur inconnue';
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
