import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';  // pour <input matInput>
import { CommonModule } from '@angular/common'; // Importer CommonModule
import {MatButtonModule } from '@angular/material/button'; // Importer MatButtonModule
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, CommonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    const success = this.authService.login(this.username, this.password); // appele la méthode login de AuthService avec les champs du fomulaires
    if (success) { // si la connexion est réussie
      this.router.navigate(['/']); // rediriges vers le flux
    } else { // si la connexion échoue
      this.loginFailed = true; // affiche un message d'erreur
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
