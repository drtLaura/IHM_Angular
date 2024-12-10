import { Injectable } from '@angular/core';

export interface Song {
  id: number;
  title: string;
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private playlists: Playlist[] = [];
  private nextId = 1;

  constructor() { }

  getPlaylists() {
    return this.playlists;
  }

  addPlaylist(name: string, songs: Song[]) {
    this.playlists.push({ id: this.nextId++, name, songs });
  }

  getPlaylistById(id: number): Playlist | undefined {
    return this.playlists.find((playlist) => playlist.id === id);
  }

  updatePlaylist(id: number, name: string, songs: Song[]) {
    const playlist = this.getPlaylistById(id);
    if (playlist) {
      playlist.name = name;
      playlist.songs = songs;
    }
  }
}

