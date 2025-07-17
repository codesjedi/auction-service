export enum AUCTION_STATUS {
  'OPEN',
}
export interface Auction {
  id: string
  title: string
  createdAt: string
  endingAt: string
  status: 'OPEN'
  highestBid: {
    amount: number
  }
}
