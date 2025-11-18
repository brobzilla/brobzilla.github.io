import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  toggleView = true;
  readonly date = new Date("2025-11-22T23:00:00");
  readonly startDate = new Date("2025-11-15T23:00:00");
  readonly total = (this.date.getTime() - this.startDate.getTime()) / 1000;
  readonly warnAt = 10;
  readonly dangerAt = 5;

  readonly secondsRemaining = signal(this.total);
  readonly formattedRemaining = computed(() =>
    this.formattedTime(this.secondsRemaining()));

  readonly hoursRemaining = computed(() =>
    this.formattedHours(this.secondsRemaining()));

  constructor() {
    const timerId = setInterval(() => {
      this.secondsRemaining.update(this.getSeconds.bind(this));
    }, 500);

    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => clearInterval(timerId));
  }

  private getSeconds() {
    return (this.date.getTime() - new Date().getTime()) / 1000;
  }

  private formattedTime(totalSeconds: number): string {
    let res = this.daysUntil(this.date)
    return  `${res.days} days ${res.hours} hours ${res.minutes} minutes ${res.seconds} seconds`;
  }

  private formattedHours(totalSeconds: number): string {
    let res = this.hoursUntil(this.date)
    return  `${res.hours} hours ${res.minutes} minutes ${res.seconds} seconds`;
  }

  private daysUntil(target: Date) {
    const now = new Date();
    let diff = target.getTime() - now.getTime(); // ms difference

    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }

  private hoursUntil(target: Date) {
    const now = new Date();
    let diff = target.getTime() - now.getTime(); // milliseconds

    if (diff < 0) diff = 0; // already passed

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor(diff / (1000 * 60 * 60));

    return { hours, minutes, seconds };
  }

}
