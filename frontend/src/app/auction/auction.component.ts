import { Component, computed, effect, input, signal } from '@angular/core';
import { Auction, Bid } from '../models/auction.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent {
  auction = input.required<Auction>();
  highestBid = 0;

  private currentTime = signal(new Date().getTime());
  private intervalId: any;

  // Compute time left based on the current time
  timeLeft = computed(() => {
    const now = this.currentTime();
    const startTime = new Date(this.auction().duration.start).getTime();
    const endTime = new Date(this.auction().duration.end).getTime();

    if (now < startTime) return 'Auction not yet started';
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) return 'Auction ended';
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / 1000 / 60 / 60) % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  });

  constructor(private http: HttpClient) {
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
