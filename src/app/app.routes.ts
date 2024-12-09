import { Routes } from '@angular/router';
import { FluxComponent } from './flux/flux.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {
    path: '', component: FluxComponent
    },
    {
    path: 'login', component: LoginComponent
    },
    {
    path: 'register', component: RegisterComponent
    }
];
