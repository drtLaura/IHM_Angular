import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../modeles/user.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: WritableSignal<boolean> = signal(false); //permet de suivre l'état d'authentification
  currentUser: WritableSignal<{ idUser: number; username: string, pp: string } | null> = signal(null); // permet de suivre l'utilisateur actuel

  private Users: User[] = [
    { idUser: 1, username: 'user1', password: 'pass1', pp : 'assets/images/pp1.jpg'  },
    { idUser: 2, username: 'user2', password: 'pass2', pp : 'assets/images/pp2.jpg' },
  ];

  constructor() {}

  getUserById(userId: number): User | undefined { // récupérer les infos des users par leur id (id, username, pp)
    return this.Users.find(user => user.idUser === userId);
  }

  getUserProfilePictureById(idUser: number): string | undefined { // récupérer la photo de profil des users par leur username
    const user = this.Users.find(u => u.idUser === idUser);
    return user?.pp;
  }

  getUserNameById(idUser: number): string | undefined { // récupérer la photo de profil des users par leur username
    const user = this.Users.find(u => u.idUser === idUser);
    return user?.username;
  }

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
      this.currentUser.set({ idUser: user.idUser, username: user.username, pp : user.pp}); // maj signal de l'utilisateur actuel
      return { success: true }; // retourne un objet avec un succès
    } else { // si l'utilisateur n'existe pas
      this.isAuthenticated.set(false); // maj signal d'authentification
      this.currentUser.set(null); // maj signal de l'utilisateur actuel
      return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }
  }

  // méthode pour s'inscrire
  register(username: string, password1: string, password2: string, pp : string): { success: boolean, message?: string } {
    if (!username || !password1 || !password2 || !pp ) { // si les champs ne sont pas remplis
      return { success: false, message: 'Veuillez remplir tous les champs' };
    }

    if (password1 !== password2) { // si les mots de passe ne correspondent pas
      return { success: false, message: 'Les mots de passe ne correspondent pas' };
    }

    // on regarde si l'username existe déjà
    const existingUser = this.Users.find((user) => user.username === username);
    if (existingUser) { // si l'utilisateur existe déjà
      return { success: false, message: 'L\'utilisateur existe déjà' };
    }

    // on crée un nouvel utilisateur
    const newUser = {
      idUser: this.Users.length + 1,
      username: username,
      password: password1,
      pp : pp
    };

    this.Users.push(newUser); // ajout à la liste des utilisateurs

    this.isAuthenticated.set(true); // maj signal d'authentification
    this.currentUser.set({ idUser: newUser.idUser, username: newUser.username, pp : newUser.pp }); // maj signal de l'utilisateur actuel
    return { success: true }; // retourne un objet avec un succès
  }

  logout(): void { // méthode pour se déconnecter
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
