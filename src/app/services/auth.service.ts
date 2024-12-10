import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false); // Statut d'authentification : vrai ou faux
  private currentUser = new BehaviorSubject<{ id: number; username: string } | null>(null); // Informations de l'utilisateur actuel
  private Users = [
    { id: 1, username: 'user1', password: 'pass1' },
    { id: 2, username: 'user2', password: 'pass2' },
  ];

  constructor() {}

  isAuth(): Observable<boolean> {  // vérifie si l'utilisateur est authentifié
    return this.isAuthenticated.asObservable(); // renvoie un observable de behavior subject le statut d'authentification (vrai ou faux)
  }

  getCurrentUser(): { id: number, username: string } | null { // récupérer les informations de l'utilisateur
    return this.currentUser.value; // renvoie les info de l'utilisateur
  }

  login(username: string, password: string): boolean { // récup les champs du formulaire
    const user = this.Users.find( // on vérifie si l'utilisateur existe
      (u) => u.username === username && u.password === password
    );

    if (user) { // si l'utilisateur existe
      this.isAuthenticated.next(true); // maj du statut à true (authentifié)
      this.currentUser.next({ id: user.id, username: user.username }); // met à jour les info de l'utilisateur
      return true; // connexion réussie
    } else { // ci l'utilisateur n'existe pas
      this.isAuthenticated.next(false); // maj du statut à false (non authentifié)
      this.currentUser.next(null); //maj des info de l'utilisateur à null
      return false; // connexion échouée
    }
  }

  register(username: string, password1: string, password2: string): boolean {
    console.log('voici les utilisateurs, register1', this.Users);

    if (password1 !== password2) {
      return false; // vérification des mdp
    }

    const existingUser = this.Users.find((user) => user.username === username);
    if (existingUser) {
      return false; // verification de l'existence de l'utilisateur
    }

    const newUser = {
      id: this.Users.length + 1, // générer un nouvel id
      username: username,
      password: password1,
    };

    this.Users.push(newUser); // ajouter le nouvel utilisateur à la liste

    this.isAuthenticated.next(true); // authentifié après l'inscription
    this.currentUser.next({ id: newUser.id, username: newUser.username });
    console.log('voici les utilisateurs, register', this.Users);
    return true; // inscription réussie
  }

  logout(): void {
    this.isAuthenticated.next(false); // maj du statut à false (non authentifié)
    this.currentUser.next(null); // maj des info de l'utilisateur à null
  }
}
