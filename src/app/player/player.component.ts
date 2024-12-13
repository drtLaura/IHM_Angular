import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerService } from '../services/audio-player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PlayerComponent {
  constructor(public audioService: AudioPlayerService) { }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  onSeek(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = parseFloat(inputElement.value);
      this.audioService.seek(value);
    }
  }


}
