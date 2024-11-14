import { Component, input } from '@angular/core';
import { Auction } from '../../shared/models/auction.model';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent {
  auction = input.required<Auction>();

}
