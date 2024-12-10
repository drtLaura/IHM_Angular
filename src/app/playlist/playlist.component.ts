import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PlaylistComponent {
  playlistName = ''; // Nom de la playlist
  newSongs: any[] = []; // Liste des chansons à ajouter
  playlists = [
    { name: 'Rap', songs: [{ title: 'Pop Smoke - Mannequin ft Lil Tjay', url: '/assets/audio/pop.mp3' }, { title: 'SCH - 2:00 ft Damso', url: 'assets/audio/sch.mp3' }] },
    { name: 'Pop', songs: [{ title: 'SCH - 2:00 ft Damso', url: 'assets/audio/sch.mp3' }, { title: 'Song B', url: 'assets/audio/songB.mp3' }] },
  ];
  selectedPlaylist: any = null;
  editing = false;
  isEditing = false;

  // Fonction pour créer une nouvelle playlist
  startNewPlaylist() {
    this.resetForm();
    this.editing = true; // Passer en mode création
    this.isEditing = false; // Ce n'est pas une modification
    this.selectedPlaylist = null; // Désélectionner toute playlist existante
  }

  // Sélectionner une playlist
  selectPlaylist(playlist: any) {
    this.selectedPlaylist = playlist;
    this.editing = false; // Cacher le formulaire d'édition
    this.isEditing = false;
  }

  // Ajouter des fichiers audio à la playlist
  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileUrl = URL.createObjectURL(file); // Créer une URL pour l'audio sélectionné
      const songTitle = file.name.split('.')[0]; // Utiliser le nom du fichier comme titre
      this.newSongs.push({ title: songTitle, url: fileUrl });
    }
  }

  // Lecture du fichier audio
  playAudio(url: string) {
    const audio = new Audio(url);
    audio.play();
  }

  // Ajouter un nouveau son
  addSong() {
    // Cette méthode n'est plus nécessaire, car on ajoute directement les fichiers audio via le sélecteur de fichiers
  }

  // Supprimer un son
  deleteSong(index: number) {
    this.newSongs.splice(index, 1);
  }

  // Enregistrer la playlist (création ou mise à jour)
  savePlaylist() {
    if (this.isEditing) {
      // Mise à jour de la playlist sélectionnée
      this.selectedPlaylist.name = this.playlistName;
      this.selectedPlaylist.songs = [...this.newSongs];
    } else {
      // Création d'une nouvelle playlist
      if (this.playlistName) {
        const newPlaylist = {
          name: this.playlistName,
          songs: [...this.newSongs],
        };
        this.playlists.push(newPlaylist);
      }
    }
    this.resetForm();
    this.selectedPlaylist = this.playlists.find(p => p.name === this.playlistName); // Sélectionner la playlist mise à jour
  }

  // Mode édition d'une playlist
  editPlaylist() {
    this.editing = true;
    this.isEditing = true; // Passe en mode modification
    this.playlistName = this.selectedPlaylist.name;
    this.newSongs = [...this.selectedPlaylist.songs];
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.playlistName = '';
    this.newSongs = [];
    this.editing = false;
    this.isEditing = false;
  }

  // Deselect une playlist (retour à la liste)
  deselectPlaylist() {
    this.selectedPlaylist = null;
  }
}
