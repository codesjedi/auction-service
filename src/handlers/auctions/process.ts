import { APIGatewayProxyEvent } from 'aws-lambda'

async function processAuctions(event: APIGatewayProxyEvent) {
  console.log('processing auctions!')
}

export const handler = processAuctions
