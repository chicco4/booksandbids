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

  timeLeft = computed(() => {
    const auction = this.auction();
    if (!auction) return 'Loading...';
    const now = new Date().getTime();
    const endTime = new Date(auction.duration.end).getTime();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) return 'Auction ended';
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / 1000 / 60 / 60) % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  });

  constructor() {
    effect(() => {
      const interval = setInterval(() => {
        this.timeLeft(); // Trigger recalculation
      }, 1000);
      return () => clearInterval(interval); // Cleanup on destroy
    });
  }
}
