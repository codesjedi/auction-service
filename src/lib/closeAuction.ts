import { Auction } from '@/types/auction'

import { dynamoDb } from './dynamo'

export async function closeAuction(auction: Auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ReturnValues: 'ALL_NEW',
  }

  const result = await dynamoDb.update(params).promise()
  return result.Attributes
}
