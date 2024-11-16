import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Auction } from '../models/auction.model';
import { AuctionComponent } from "../auction/auction.component";

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-auctions',
  standalone: true,
  imports: [AuctionComponent, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './auctions.component.html',
  styleUrl: './auctions.component.css'
})
export class AuctionsComponent {
  auctions: Auction[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Auction[]>('http://127.0.0.1:5000/api/auctions/').subscribe(data => {
      this.auctions = data;
      console.log(this.auctions);
    });
  }
}
