import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: WritableSignal<boolean> = signal(false); //permet de suivre l'état d'authentification
  currentUser: WritableSignal<{ id: number; username: string } | null> = signal(null); // permet de suivre l'utilisateur actuel

  private Users = [
    { id: 1, username: 'user1', password: 'pass1' },
    { id: 2, username: 'user2', password: 'pass2' },
  ];

  constructor() {}

  // méthode pour se connecter
  login(username: string, password: string): { success: boolean; message?: string } { // ? = factultatif
    if (!username || !password) { // si les champs ne sont pas remplis
      return { success: false, message: 'Veuillez remplir tous les champs' };
    }

    const user = this.Users.find( // vérifie si l'utilisateur existe
      (u) => u.username === username && u.password === password
    );

    if (user) { // si l'utilisateur existe
      this.isAuthenticated.set(true); // maj signal d'authentification
      this.currentUser.set({ id: user.id, username: user.username }); // maj signal de l'utilisateur actuel
      return { success: true }; // retourne un objet avec un succès
    } else { // si l'utilisateur n'existe pas
      this.isAuthenticated.set(false); // maj signal d'authentification
      this.currentUser.set(null); // maj signal de l'utilisateur actuel
      return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }
  }

  // méthode pour s'inscrire
  register(username: string, password1: string, password2: string): { success: boolean, message?: string } {
    if (!username || !password1 || !password2) { // si les champs ne sont pas remplis
      return { success: false, message: 'Veuillez remplir tous les champs' };
    }

    if (password1 !== password2) { // si les mots de passe ne correspondent pas
      return { success: false, message: 'Les mots de passe ne correspondent pas' };
    }

    // on regarde si les identifiants existent déjà
    const existingUser = this.Users.find((user) => user.username === username);
    if (existingUser) { // si l'utilisateur existe déjà
      return { success: false, message: 'L\'utilisateur existe déjà' };
    }

    // on crée un nouvel utilisateur
    const newUser = {
      id: this.Users.length + 1,
      username: username,
      password: password1,
    };

    this.Users.push(newUser); // ajout à la liste des utilisateurs

    this.isAuthenticated.set(true); // maj signal d'authentification
    this.currentUser.set({ id: newUser.id, username: newUser.username }); // maj signal de l'utilisateur actuel
    return { success: true }; // retourne un objet avec un succès
  }

  logout(): void { // méthode pour se déconnecter
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
