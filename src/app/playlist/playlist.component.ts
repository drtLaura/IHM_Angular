import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioPlayerService } from '../services/audio-player.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PlaylistComponent {
  playlistName = '';
  newSongs: any[] = [];
  playlists = [
    { name: 'Rap', songs: [{ title: 'Pop Smoke - Mannequin ft Lil Tjay', url: '/assets/audio/pop.mp3' }, { title: 'SCH - 2:00 ft Damso', url: '/assets/audio/sch.mp3' }] },
    { name: 'Pop', songs: [{ title: 'Dua Lipa - Levitating ft DaBaby', url: '/assets/audio/dua.mp3' }, { title: 'PinkPantheress - Nice to meet you', url: '/assets/audio/pink.mp3' }] },
  ];
  selectedPlaylist: any = null;
  editing = false;
  isEditing = false;

  constructor(public audioService: AudioPlayerService) { }

  // Commencer la création d'une nouvelle playlist
  startNewPlaylist() {
    this.resetForm();
    this.editing = true;
    this.isEditing = false;
    this.selectedPlaylist = null;
  }

  // Sélectionner une playlist existante
  selectPlaylist(playlist: any) {
    this.selectedPlaylist = playlist;
    this.editing = false;
    this.isEditing = false;
    this.setPlaylist(playlist.songs)
  }

  // Ajouter des chansons à partir de fichiers
  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileUrl = URL.createObjectURL(file);
      const songTitle = file.name.split('.')[0];
      this.newSongs.push({ title: songTitle, url: fileUrl });
    }
  }

  // Joue une chanson en utilisant le service audio
  playSong(url: string, title: string) {
    this.audioService.play(url, title);
  }

  // Définit une playlist complète dans le service audio
  setPlaylist(songs: { title: string; url: string }[]) {
    const songUrls = songs.map(song => song.url);
    const songTitle = songs.map(song => song.title)
    this.audioService.setPlaylist(songs);
  }

  // Modifier une playlist existante
  editPlaylist() {
    this.editing = true;
    this.isEditing = true;
    this.playlistName = this.selectedPlaylist.name;
    this.newSongs = [...this.selectedPlaylist.songs];
  }

  // Enregistrer une nouvelle playlist ou mettre à jour une existante
  savePlaylist() {
    if (this.isEditing) {
      this.selectedPlaylist.name = this.playlistName;
      this.selectedPlaylist.songs = [...this.newSongs];
    } else {
      if (this.playlistName) {
        const newPlaylist = {
          name: this.playlistName,
          songs: [...this.newSongs],
        };
        this.playlists.push(newPlaylist);
      }
    }
    this.resetForm();
    this.selectedPlaylist = this.playlists.find(p => p.name === this.playlistName);
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.playlistName = '';
    this.newSongs = [];
    this.editing = false;
    this.isEditing = false;
  }

  // Désélectionner la playlist en cours
  deselectPlaylist() {
    this.selectedPlaylist = null;
  }

  // Supprimer une chanson en cours d'édition
  deleteSong(index: number) {
    this.newSongs.splice(index, 1);
  }

  formatTime(time: number | null): string {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  onSeek(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = parseFloat(inputElement.value);
      this.audioService.seek(value);
    }
  }
}
