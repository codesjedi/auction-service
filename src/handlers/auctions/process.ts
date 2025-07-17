import { getEndedAuctions } from '../../lib/getEndedAuctions'

async function processAuctions() {
  console.log('processing auctions!')
  const auctionsToClose = await getEndedAuctions()
  console.log(auctionsToClose)
}

export const handler = processAuctions
