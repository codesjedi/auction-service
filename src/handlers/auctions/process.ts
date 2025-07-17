import { APIGatewayProxyEvent } from 'aws-lambda'

import { getEndedAuctions } from '../../lib/getEndedAuctions'

async function processAuctions(event: APIGatewayProxyEvent) {
  console.log('processing auctions!')
  const auctionsToClose = await getEndedAuctions()
  console.log(auctionsToClose)
}

export const handler = processAuctions
