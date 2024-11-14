import { Component, computed, effect, input, signal } from '@angular/core';
import { Auction } from '../../shared/models/auction.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent {
  auction = input.required<Auction>();

  private currentTime = signal(new Date().getTime());
  private intervalId: any;

  // Compute time left based on the current time
  timeLeft = computed(() => {
    const now = this.currentTime();
    const endTime = new Date(this.auction().duration.end).getTime();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) return 'Auction ended';
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / 1000 / 60 / 60) % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  });

  constructor() {
    // Update the `currentTime` signal every second
    this.intervalId = setInterval(() => {
      this.currentTime.set(new Date().getTime());
    }, 1000);
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
