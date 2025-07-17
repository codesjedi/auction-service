export interface Auction {
  id: string
  title: string
  createdAt: string
  endingAt: string
  status: 'OPEN' | 'CLOSED'
  highestBid: {
    amount: number
  }
}
