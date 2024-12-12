import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  currentTime = 0;
  duration = 0;
  isPlaying = false; // État de lecture
  private playlist: { title: string; url: string }[] = []; // Playlist avec titre et URL
  private currentTrackIndex = 0; // Index de la piste actuelle
  currentTrackTitle = ''; // Titre de la piste en cours

  // Lecture d'un fichier audio spécifique
  play(url: string, title: string) {
    // Vérification de l'URL avant de charger
    const audioUrl = new URL(url, window.location.origin).toString();
    console.log('Lecture de l\'URL:', audioUrl); // Log l'URL pour vérifier

    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(audioUrl);

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio?.currentTime || 0;
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio?.duration || 0;
    });

    this.audio.addEventListener('ended', () => {
      this.next(); // Passe automatiquement à la piste suivante
    });

    this.audio.play().catch((error) => {
      console.error('Erreur lors de la lecture du fichier audio:', error); // Capture et log l'erreur
    });

    this.isPlaying = true;
    this.currentTrackTitle = title; // Met à jour le titre de la piste en cours
  }

  // Lecture de la piste courante
  playCurrent() {
    if (this.playlist.length > 0) {
      const currentTrack = this.playlist[this.currentTrackIndex];
      this.play(currentTrack.url, currentTrack.title);
    }
  }

  // Mise en pause
  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  // Reprise de la lecture
  resume() {
    if (this.audio) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  // Avancer à une position précise
  seek(value: number) {
    if (this.audio) {
      this.audio.currentTime = value;
    }
  }

  // Définir la playlist
  setPlaylist(playlist: { title: string; url: string }[]) {
    this.playlist = playlist;
    this.currentTrackIndex = 0; // Réinitialise l'index
    if (playlist.length > 0) {
      this.playCurrent(); // Joue la première piste
    }
  }

  // Passer à la piste suivante
  next() {
    if (this.playlist.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
      const nextTrack = this.playlist[this.currentTrackIndex]; // Accédez correctement au titre et à l'URL
      this.play(nextTrack.url, nextTrack.title); // Passe à la piste suivante
    }
  }

  // Revenir à la piste précédente
  previous() {
    if (this.playlist.length > 0) {
      this.currentTrackIndex =
        (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
      const previousTrack = this.playlist[this.currentTrackIndex]; // Accédez correctement au titre et à l'URL
      this.play(previousTrack.url, previousTrack.title); // Reviens à la piste précédente
    }
  }

  // Basculer entre lecture et pause
  togglePlay() {
    if (this.audio) {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  }
}
