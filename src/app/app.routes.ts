import { Routes } from '@angular/router';
import { FluxComponent } from './flux/flux.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FriendsComponent } from './friends/friends.component';
// import { authGuard } from './services/guards/auth.guard';
export const routes: Routes = [
  {
    path: '', redirectTo: 'flux', pathMatch: 'full' // redirige vers le flux par défaut, uniquement si le chemin est vide
  },
  {
    path: 'flux', component: FluxComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  { path: '**', redirectTo: 'login' },
];
