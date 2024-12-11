import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: WritableSignal<boolean> = signal(false); //permet de suivre l'état d'authentification
  currentUser: WritableSignal<{ id: number; username: string, pp: string } | null> = signal(null); // permet de suivre l'utilisateur actuel

  private friends = new BehaviorSubject<{ id: number; username: string }[]>([]);
  private currentId : number = 0;
  private Users: User[] = [
    { id: 1, username: 'user1', password: 'pass1', pp : 'assets/images/pp1.jpg'  },
    { id: 2, username: 'user2', password: 'pass2', pp : 'assets/images/pp2.jpg' },
  ];

  constructor() {}
  // isAuth(): Observable<boolean> {  // vérifie si l'utilisateur est authentifié
  //   return this.isAuthenticated.asObservable(); // renvoie un observable de behavior subject le statut d'authentification (vrai ou faux)
  // }

  getCurrentUser(): { id: number, username: string } | null { // récupérer les informations de l'utilisateur
    return this.currentUser(); // renvoie les info de l'utilisateur
  }

  getCurrentUserId(): number {
    return this.currentId;
  }

  getUserById(userId: number): User | undefined { // récupérer les infos des users par leur id (id, username, pp)
    return this.Users.find(user => user.id === userId);
  }

  getUserProfilePictureById(id: number): string | undefined { // récupérer la photo de profil des users par leur username
    const user = this.Users.find(u => u.id === id);
    return user?.pp;
  }

  getUserNameById(idUser: number): string | undefined { // récupérer la photo de profil des users par leur username
    const user = this.Users.find(u => u.id === idUser);
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
      this.currentUser.set({ id: user.id, username: user.username, pp : user.pp}); // maj signal de l'utilisateur actuel
      this.currentId = user.id;
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
      id: this.Users.length + 1,
      username: username,
      password: password1,
      pp : pp
    };

    this.Users.push(newUser); // ajout à la liste des utilisateurs

    this.isAuthenticated.set(true); // maj signal d'authentification
    this.currentUser.set({ id: newUser.id, username: newUser.username, pp : newUser.pp }); // maj signal de l'utilisateur actuel
    this.currentId = newUser.id;
    return { success: true }; // retourne un objet avec un succès
  }

  logout(): void { // méthode pour se déconnecter
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  getFriends(): Observable<{ id: number; username: string }[]> {
    return this.friends.asObservable();
  }

  addFriend(userId: number): boolean {
    const user = this.Users.find((u) => u.id === userId);
    const currentFriends = this.friends.value;

    if (user && !currentFriends.some((f) => f.id === userId)) {
      this.friends.next([...currentFriends, user]);
      return true;
    }
    return false;
  }

  removeFriend(userId: number): boolean {
    const currentFriends = this.friends.value;
    if (currentFriends.some((f) => f.id === userId)) {
      this.friends.next(currentFriends.filter((f) => f.id !== userId));
      return true;
    }
    return false;
  }

}
