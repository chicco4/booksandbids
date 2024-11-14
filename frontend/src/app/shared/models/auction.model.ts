export type Auction = {
  _id: string;
  sellerId: string,
  book: Book;
  duration: {
    start: Date;
    end: Date;
  }
  bids: Bid[];
  messages: Message[];
  startingPrice: number;
  reservePrice: number;
  status: 'waiting' | 'active' | 'succeded' | `failed` | 'deleted';
}

type Book = {
  title: string;
  author: string;
  ISBN: string;
  course: string,
  university: string,
  edition: string,
  publisher: string,
}

type Bid = {
  _id: string,
  bidderId: string,
  amount: number,
  createdAt: Date,
}

type Message = {
  _id: string;
  senderId: string;
  content: string;
  isPrivate: boolean,
  createdAt: Date;
}